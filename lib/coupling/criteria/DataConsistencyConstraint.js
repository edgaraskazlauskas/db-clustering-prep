const CouplingCriteriaBase = require("./CouplingCriteriaBase");

module.exports = class DataConsistencyConstraint extends CouplingCriteriaBase {
  evaluate() {
    this.entityRelationshipModel;
  }
};
