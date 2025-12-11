const c = require('../../shared/util/constants');
const FamilyPlanService = require('../services/familyPlan.service');

const getFamilyPlans = async (req, res, next) => {
  try {
    let jsonResponse = await FamilyPlanService.getFamilyPlans();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFamilyPlans };
