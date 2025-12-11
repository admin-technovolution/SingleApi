const c = require('../../shared/util/constants');
const DrinkingHabitService = require('../services/drinkingHabit.service');

const getDrinkingHabits = async (req, res, next) => {
  try {
    let jsonResponse = await DrinkingHabitService.getDrinkingHabits();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDrinkingHabits };
