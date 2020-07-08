var HealthStatus = artifacts.require("./HealthStatus.sol");

module.exports = function(deployer) {
  deployer.deploy(HealthStatus);
};
