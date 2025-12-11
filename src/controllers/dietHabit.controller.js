const c = require('../../shared/util/constants');
const DietHabitService = require('../services/dietHabit.service');

const getDietHabits = async (req, res, next) => {
  try {
    let jsonResponse = await DietHabitService.getDietHabits();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDietHabits };
