// @ts-check

const CouplingCriteriaBase = require("../criteria/CouplingCriteriaBase");

module.exports = class UserConstraintWeight {
  /**
   * @param {CouplingCriteriaBase[]} couplingCriteria
   */
  constructor(couplingCriteria) {
    this.couplingCriteria = couplingCriteria;
  }

  calculate() {
    let weight = 0;

    this.couplingCriteria.forEach((couplingCriteria) => {
      weight += couplingCriteria.evaluate();
    });

    return weight;
  }
};
