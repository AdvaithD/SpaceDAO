var SpaceDAO = artifacts.require("./SpaceDAO.sol")

module.exports = function(deployer) {
  deployer.deploy(SpaceDAO);
}
