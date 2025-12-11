const c = require('../../shared/util/constants');
const ExerciseHabitService = require('../services/exerciseHabit.service');

const getExerciseHabits = async (req, res, next) => {
  try {
    let jsonResponse = await ExerciseHabitService.getExerciseHabits();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getExerciseHabits };
