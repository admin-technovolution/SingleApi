const c = require('../../shared/util/constants');
const SmokingHabitService = require('../services/smokingHabit.service');

const getSmokingHabits = async (req, res, next) => {
  try {
    let jsonResponse = await SmokingHabitService.getSmokingHabits();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSmokingHabits };
