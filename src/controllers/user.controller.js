const c = require('../../shared/util/constants');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const UserService = require('../services/user.service');

const deleteUserAccount = async (req, res, next) => {
  try {
    let jsonResponse = await UserService.deleteUserAccount(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    let jsonResponse = await UserService.getUserById(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    let jsonResponse = await UserService.getUserMe(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await UserService.registerUser(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await UserService.changePassword(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await UserService.updateUser(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const addImageUser = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await UserService.addImageUser(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const updateImageUser = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await UserService.updateImageUser(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const deleteImageUser = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await UserService.deleteImageUser(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  getUserMe,
  getUserById,
  updateUser,
  addImageUser,
  updateImageUser,
  deleteImageUser,
  changePassword,
  deleteUserAccount
};
