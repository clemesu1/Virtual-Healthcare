const PatientRecord = artifacts.require("PatientRecord");
const DoctorStorage = artifacts.require("DoctorStorage");

module.exports = function(deployer) {
    deployer.deploy(PatientRecord);
    deployer.deploy(DoctorStorage);
};