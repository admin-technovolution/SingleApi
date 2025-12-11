const { ObjectId } = require('mongodb');
const BaseResponse = require('../../shared/util/baseResponse');
const BasePaginatedResponse = require('../../shared/util/basePaginatedResponse');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const UserRepository = require('../repository/user.repository');
const c = require('../../shared/util/constants.frontcodes');
const constants = require('../../shared/util/constants');
const jwtUtil = require('../../shared/util/jwt');
const limitGetUsersDiscover = Number(process.env.LIMIT_GET_USERS_DISCOVER);

const getUsersDiscover = async (req) => {
    const queryParams = req.query;
    const auth = req.headers['authorization'];
    const userId = jwtUtil.getValueFromJwtToken(auth, 'id');

    const exclussions = '-password -created_at -status -email';
    const user = await UserRepository.findById(userId, exclussions, false);
    if (!user) throw new BusinessException(c.CODE_ERROR_USER_NOTFOUND);

    const pipeline = await createPipeline(user, queryParams);

    let users = await UserRepository.findByPipeline(pipeline, true);

    const hasMore = users.length === limitGetUsersDiscover;
    const nextCursor = (hasMore && users.length > 0) ? users[users.length - 1]._id : null;

    const response = new BasePaginatedResponse(
        users,
        {
            nextCursor,
            pageSize: users.length,
            hasMore
        });

    return new BaseResponse(true, [], response);
};

const createPipeline = async (meUser, queryParams) => {
    // Precompute my data
    const cursorObjectId = queryParams.cursor ? new ObjectId(queryParams.cursor) : null;
    const myGender = meUser.userInfo?.gender;
    const myPreferences = meUser.preferences?.preferences;
    const myLookingFor = meUser.preferences?.lookingFor;
    const myMaxDistance = meUser.profileConfig?.maximumDistance;
    const myAgeRange = meUser.profileConfig?.ageRange;
    const myOriginLocation = meUser.effectiveLocation.coordinates;

    const pipeline = [];

    // Filter by near location
    pipeline.push({
        $geoNear: {
            near: { type: "Point", coordinates: myOriginLocation },
            distanceField: "distance",
            maxDistance: myMaxDistance,
            spherical: true,
            key: "effectiveLocation.coordinates"
        }
    });

    // Exclude me, only active users
    const matchStage = {
        _id: { $ne: new ObjectId(meUser._id) },
        status: constants.STATUS_DESC_ACTIVE
    };

    // Filter by cursor to paginate results
    if (cursorObjectId) {
        matchStage._id = { ...matchStage._id, $gt: cursorObjectId };
    }

    pipeline.push({ $match: matchStage });

    // Lookup user likes and exclude them
    pipeline.push(
        {
            $lookup: {
                from: "likes",
                let: { targetId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$toUserId", "$$targetId"] },
                                    { $eq: ["$fromUserId", new ObjectId(meUser._id)] }
                                ]
                            }
                        }
                    },
                    { $limit: 1 }
                ],
                as: "likesFromMe"
            }
        },
        {
            $match: {
                likesFromMe: { $eq: [] }
            }
        }
    );

    // Lookup user matches or blocked and exclude them
    pipeline.push(
        {
            $lookup: {
                from: "matches",
                let: {
                    targetId: "$_id",
                    meId: new ObjectId(meUser._id)
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$$meId", "$users"] },
                                    { $in: ["$$targetId", "$users"] },
                                    { $in: ["$status", ["matched", "blocked"]] }
                                ]
                            }
                        }
                    },
                    { $limit: 1 }
                ],
                as: "matchWithMe"
            }
        },
        {
            $match: {
                matchWithMe: { $eq: [] }
            }
        }
    );

    // Calculating age
    pipeline.push({
        $addFields: {
            'userInfo.age': {
                $dateDiff: {
                    startDate: "$userInfo.birthdate",
                    endDate: "$$NOW",
                    unit: "year"
                }
            }
        }
    });

    // Filter by age range
    if (myAgeRange && (myAgeRange.min || myAgeRange.max)) {
        const ageMatch = {};
        if (myAgeRange.min) ageMatch.$gte = myAgeRange.min;
        if (myAgeRange.max) ageMatch.$lte = myAgeRange.max;

        pipeline.push({ $match: { 'userInfo.age': ageMatch } });
    }

    // Preferences compatibility
    pipeline.push({
        $match: {
            $expr: {
                $and: [
                    {
                        $gt: [
                            { $size: { $setIntersection: ["$preferences.preferences", [myGender]] } },
                            0
                        ]
                    },
                    {
                        $gt: [
                            { $size: { $setIntersection: [["$userInfo.gender"], myPreferences] } },
                            0
                        ]
                    }
                ]
            }
        }
    });

    // Filter by looking for
    pipeline.push({ $match: { "preferences.lookingFor": myLookingFor } });

    // Exclude fields
    pipeline.push({
        $project:
        {
            'password': 0,
            'email': 0,
            'userInfo.birthdate': 0,
            'created_at': 0,
            'status': 0,
            'likesFromMe': 0
        }
    });

    // Sort and limit for pagination
    pipeline.push(
        { $sort: { distance: 1, _id: 1 } },
        { $limit: limitGetUsersDiscover }
    );

    return pipeline;
};

module.exports = { getUsersDiscover };
