const util = require('../../../../shared/util/util');
const redis = require('../../../../shared/config/redis');
const BaseResponse = require('../../../../shared/util/baseResponse');
const c = require('../../../../shared/util/constants.frontcodes');
const consCache = require('../../../../shared/util/constants.cache');
const constants = require('../../../../shared/util/constants');
const { openChatSchema } = require('../../../validators/chat.validator');
const ChatRepository = require('../../../repository/chat.repository');
const ConversationRepository = require('../../../repository/conversation.repository');

module.exports = (socket, namespace) => {
    socket.on(constants.WS_EVENT_OPEN_CHAT, async (payload) => {
        const isValid = util.isValidSocketPayload(socket, constants.WS_EVENT_OPEN_CHAT, openChatSchema, payload);
        if (!isValid) return;

        const userId = socket.userId;
        const chat = await validateOpenChat(payload, socket, constants.WS_EVENT_OPEN_CHAT);

        if (!chat) return;

        const chatId = payload.chatId;
        chat.unreadCounts.set(userId, 0);

        await chat.save();

        const result = await ConversationRepository.updateMany(
            { chatId, seenBy: { $ne: userId } },
            { $push: { seenBy: userId } }
        );

        for (const u of chat.users) {
            const userIdStr = u.toString();
            if (userIdStr !== userId) {
                const targetSockets = await redis.sMembers(`${consCache.REDIS_KEY_USER_SOCKETS}${userIdStr}`);
                if (targetSockets && targetSockets.length > 0) {
                    for (const sid of targetSockets) {
                        const response = new BaseResponse(true, [], {
                            chatId: chatId,
                            messageRead: true
                        });
                        namespace.to(sid).emit(constants.WS_EVENT_MESSAGE_READ, JSON.stringify(response));
                    }
                }
            }
        }
    });

    const validateOpenChat = async (body, socket, eventName) => {
        const filter = {
            _id: body.chatId,
            users: socket.userId
        };

        const chatExists = await ChatRepository.findOneByFilter(filter);
        if (!chatExists) {
            const response = new BaseResponse(false, [c.CODE_CHAT_NOT_FOUND]);
            socket.emit(eventName, JSON.stringify(response));
        }

        return chatExists;
    }
};