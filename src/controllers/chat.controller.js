const ChatService = require('../services/chat.service');

const deleteChatConversation = async (req, res, next) => {
  try {
    let jsonResponse = await ChatService.deleteChatConversation(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const getChatConversations = async (req, res, next) => {
  try {
    let jsonResponse = await ChatService.getChatConversations(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const messageSeen = async (req, res, next) => {
  try {
    let jsonResponse = await ChatService.messageSeen(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const getChats = async (req, res, next) => {
  try {
    let jsonResponse = await ChatService.getChats(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getChats, messageSeen, getChatConversations, deleteChatConversation };