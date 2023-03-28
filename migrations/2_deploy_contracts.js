var Lux = artifacts.require("./Lux.sol");
var LuxMint = artifacts.require("./LuxMint.sol");
var LuxAuction = artifacts.require("./LuxAuction.sol");
var OSContract = artifacts.require("./OSContract.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Lux);
  await deployer.deploy(LuxMint);
  await deployer.deploy(LuxAuction);
  await deployer.deploy(OSContract);
};
