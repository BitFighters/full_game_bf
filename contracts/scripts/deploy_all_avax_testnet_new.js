// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balanceWei = await ethers.provider.getBalance(deployer.address);
  const balanceEther = ethers.utils.formatEther(balanceWei);

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", balanceEther, "ETH");

  //////////
  const BitFighters = await hre.ethers.getContractFactory("BitFightersNFT");

  const gasEstimate = await BitFighters.signer.estimateGas(
    BitFighters.getDeployTransaction("BitFighters", "BF")
  );

  const gasPrice = await ethers.provider.getGasPrice();
  const deploymentCostWei = gasEstimate.mul(gasPrice);
  const deploymentCostEther = ethers.utils.formatEther(deploymentCostWei);

  console.log(`Estimated gas cost: ${deploymentCostEther} ETH`);

  if (balanceWei.lt(deploymentCostWei)) {
    console.error(
      "Insufficient funds: Your balance is lower than the estimated deployment cost."
    );
    return;
  }

  const bitFighters = await BitFighters.deploy("BitFighters", "BF", {
    gasPrice: gasPrice,
  });
  await bitFighters.deployed();
  console.log("Bitfighters deployed to:", bitFighters.address);

  ///////
  const GameLogicContract = await hre.ethers.getContractFactory("GameLogic");

  const gasEstimate2 = await GameLogicContract.signer.estimateGas(
    GameLogicContract.getDeployTransaction()
  );

  const gasPrice2 = await ethers.provider.getGasPrice();
  const deploymentCostWei2 = gasEstimate2.mul(gasPrice2);
  const deploymentCostEther2 = ethers.utils.formatEther(deploymentCostWei2);

  console.log(`Estimated gas cost: ${deploymentCostEther2} ETH`);

  const gameLogic = await GameLogicContract.deploy({ gasPrice: gasPrice2 });
  await gameLogic.deployed();
  console.log("GameLogic deployed to:", gameLogic.address);

  // let testWBTC = {
  //   address: "0x2868d708e442A6a940670d26100036d426F1e16b",
  // };
  //////////////////

  const TestWBTCContract = await hre.ethers.getContractFactory("TestBits");

  const gasEstimate3 = await BitFighters.signer.estimateGas(
    TestWBTCContract.getDeployTransaction()
  );

  const gasPrice3 = await ethers.provider.getGasPrice();
  const deploymentCostWei3 = gasEstimate3.mul(gasPrice3);
  const deploymentCostEther3 = ethers.utils.formatEther(deploymentCostWei3);

  console.log(`Estimated gas cost: ${deploymentCostEther3} ETH`);

  const testWBTC = await TestWBTCContract.deploy();
  await testWBTC.deployed();
  console.log("textbtc deployed to:", testWBTC.address);

  tx = await bitFighters.setNumberOfNFTsLimitForGenN(10000, 0);
  await tx.wait();

  tx = await bitFighters.changeMinitngState(true);
  await tx.wait();

  tx = await bitFighters.setGameLogicContract(gameLogic.address);
  await tx.wait();

  tx = await gameLogic.setBtcbContract(testWBTC.address);
  await tx.wait();

  tx = await gameLogic.setBitFightersContract(bitFighters.address);
  await tx.wait();

  // setting packs
  tx = await gameLogic.addPackInfo(5, 150000);
  await tx.wait();

  tx = await gameLogic.addPackInfo(10, 250000);
  await tx.wait();

  tx = await gameLogic.addPackInfo(20, 450000);
  await tx.wait();

  console.log(
    "limit of gen 0 --> ",
    await bitFighters.limitCountOfGenNBitfighters(0)
  );
  console.log("state of gen 0 --> ", await bitFighters.readyToMint());

  const treasuryWallet = "0x1D5215041824138CB82576e961e10eA350D7ed99";
  const systemWallet1 = "0x01135d54F00EF92F289a068C1478478E5c3eECC0";
  const systemWallet2 = "0x940B3c799069BfB20902EC298A44F7f20672bcf4";
  const depositWallet = "0x7907525d38308AC0cB3dd8D2cb4f44E93Cd2Ec8C";
  const atmVault = "0x69E653020C24Ea59890B4c10731A887FF444438D";

  console.log("setting wallet addreses in gamelogic contract...");
  tx = await gameLogic.setAllWallets(
    treasuryWallet,
    systemWallet1,
    systemWallet2,
    depositWallet,
    atmVault
  );
  await tx.wait();

  console.log("wallet setting done...");

  fs.writeFileSync(
    "new_configs/config_v7.js",
    `export const bitFightersAddress = "${bitFighters.address}"
  export const gameLogicAddress = "${gameLogic.address}"
  export const testWbtcAddress = "${testWBTC.address}"`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
