const PatientRecord = artifacts.require("PatientRecord");

module.exports = function(deployer) {
    deployer.deploy(PatientRecord);
};