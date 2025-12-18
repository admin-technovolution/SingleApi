const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const FamilyPlanRepository = require('../repository/familyPlan.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getFamilyPlans = async () => {
    let familyPlans = cache.get(consCache.CACHE_KEY_FAMILY_PLANS);
    if (!familyPlans || familyPlans.length === 0) {
        familyPlans = await FamilyPlanRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_FAMILY_PLANS, familyPlans, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = familyPlans);
};

module.exports = { getFamilyPlans };
