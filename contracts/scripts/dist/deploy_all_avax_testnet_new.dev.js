"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
var hre = require("hardhat");

var fs = require("fs");

function main() {
  var _ref, _ref2, deployer, balanceWei, balanceEther, BitFighters, gasEstimate, gasPrice, deploymentCostWei, deploymentCostEther, bitFighters, GameLogicContract, gasEstimate2, gasPrice2, deploymentCostWei2, deploymentCostEther2, gameLogic, TestWBTCContract, gasEstimate3, gasPrice3, deploymentCostWei3, deploymentCostEther3, testWBTC, treasuryWallet, systemWallet1, systemWallet2, depositWallet, atmVault;

  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(ethers.getSigners());

        case 2:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          deployer = _ref2[0];
          _context.next = 7;
          return regeneratorRuntime.awrap(ethers.provider.getBalance(deployer.address));

        case 7:
          balanceWei = _context.sent;
          balanceEther = ethers.utils.formatEther(balanceWei);
          console.log("Deploying contracts with account:", deployer.address);
          console.log("Account balance:", balanceEther, "ETH"); //////////

          _context.next = 13;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("BitFightersNFT"));

        case 13:
          BitFighters = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(BitFighters.signer.estimateGas(BitFighters.getDeployTransaction("BitFighters", "BF")));

        case 16:
          gasEstimate = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(ethers.provider.getGasPrice());

        case 19:
          gasPrice = _context.sent;
          deploymentCostWei = gasEstimate.mul(gasPrice);
          deploymentCostEther = ethers.utils.formatEther(deploymentCostWei);
          console.log("Estimated gas cost: ".concat(deploymentCostEther, " ETH"));

          if (!balanceWei.lt(deploymentCostWei)) {
            _context.next = 26;
            break;
          }

          console.error("Insufficient funds: Your balance is lower than the estimated deployment cost.");
          return _context.abrupt("return");

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(BitFighters.deploy("BitFighters", "BF", {
            gasPrice: gasPrice
          }));

        case 28:
          bitFighters = _context.sent;
          _context.next = 31;
          return regeneratorRuntime.awrap(bitFighters.deployed());

        case 31:
          console.log("Bitfighters deployed to:", bitFighters.address); ///////

          _context.next = 34;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("GameLogic"));

        case 34:
          GameLogicContract = _context.sent;
          _context.next = 37;
          return regeneratorRuntime.awrap(GameLogicContract.signer.estimateGas(GameLogicContract.getDeployTransaction()));

        case 37:
          gasEstimate2 = _context.sent;
          _context.next = 40;
          return regeneratorRuntime.awrap(ethers.provider.getGasPrice());

        case 40:
          gasPrice2 = _context.sent;
          deploymentCostWei2 = gasEstimate2.mul(gasPrice2);
          deploymentCostEther2 = ethers.utils.formatEther(deploymentCostWei2);
          console.log("Estimated gas cost: ".concat(deploymentCostEther2, " ETH"));
          _context.next = 46;
          return regeneratorRuntime.awrap(GameLogicContract.deploy({
            gasPrice: gasPrice2
          }));

        case 46:
          gameLogic = _context.sent;
          _context.next = 49;
          return regeneratorRuntime.awrap(gameLogic.deployed());

        case 49:
          console.log("GameLogic deployed to:", gameLogic.address); // let testWBTC = {
          //   address: "0x2868d708e442A6a940670d26100036d426F1e16b",
          // };
          //////////////////

          _context.next = 52;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("TestBits"));

        case 52:
          TestWBTCContract = _context.sent;
          _context.next = 55;
          return regeneratorRuntime.awrap(BitFighters.signer.estimateGas(TestWBTCContract.getDeployTransaction()));

        case 55:
          gasEstimate3 = _context.sent;
          _context.next = 58;
          return regeneratorRuntime.awrap(ethers.provider.getGasPrice());

        case 58:
          gasPrice3 = _context.sent;
          deploymentCostWei3 = gasEstimate3.mul(gasPrice3);
          deploymentCostEther3 = ethers.utils.formatEther(deploymentCostWei3);
          console.log("Estimated gas cost: ".concat(deploymentCostEther3, " ETH"));
          _context.next = 64;
          return regeneratorRuntime.awrap(TestWBTCContract.deploy());

        case 64:
          testWBTC = _context.sent;
          _context.next = 67;
          return regeneratorRuntime.awrap(testWBTC.deployed());

        case 67:
          console.log("textbtc deployed to:", testWBTC.address);
          _context.next = 70;
          return regeneratorRuntime.awrap(bitFighters.setNumberOfNFTsLimitForGenN(10000, 0));

        case 70:
          tx = _context.sent;
          _context.next = 73;
          return regeneratorRuntime.awrap(tx.wait());

        case 73:
          _context.next = 75;
          return regeneratorRuntime.awrap(bitFighters.changeMinitngState(true));

        case 75:
          tx = _context.sent;
          _context.next = 78;
          return regeneratorRuntime.awrap(tx.wait());

        case 78:
          _context.next = 80;
          return regeneratorRuntime.awrap(bitFighters.setGameLogicContract(gameLogic.address));

        case 80:
          tx = _context.sent;
          _context.next = 83;
          return regeneratorRuntime.awrap(tx.wait());

        case 83:
          _context.next = 85;
          return regeneratorRuntime.awrap(gameLogic.setBtcbContract(testWBTC.address));

        case 85:
          tx = _context.sent;
          _context.next = 88;
          return regeneratorRuntime.awrap(tx.wait());

        case 88:
          _context.next = 90;
          return regeneratorRuntime.awrap(gameLogic.setBitFightersContract(bitFighters.address));

        case 90:
          tx = _context.sent;
          _context.next = 93;
          return regeneratorRuntime.awrap(tx.wait());

        case 93:
          _context.next = 95;
          return regeneratorRuntime.awrap(gameLogic.addPackInfo(5, 150000));

        case 95:
          tx = _context.sent;
          _context.next = 98;
          return regeneratorRuntime.awrap(tx.wait());

        case 98:
          _context.next = 100;
          return regeneratorRuntime.awrap(gameLogic.addPackInfo(10, 250000));

        case 100:
          tx = _context.sent;
          _context.next = 103;
          return regeneratorRuntime.awrap(tx.wait());

        case 103:
          _context.next = 105;
          return regeneratorRuntime.awrap(gameLogic.addPackInfo(20, 450000));

        case 105:
          tx = _context.sent;
          _context.next = 108;
          return regeneratorRuntime.awrap(tx.wait());

        case 108:
          _context.t0 = console;
          _context.next = 111;
          return regeneratorRuntime.awrap(bitFighters.limitCountOfGenNBitfighters(0));

        case 111:
          _context.t1 = _context.sent;

          _context.t0.log.call(_context.t0, "limit of gen 0 --> ", _context.t1);

          _context.t2 = console;
          _context.next = 116;
          return regeneratorRuntime.awrap(bitFighters.readyToMint());

        case 116:
          _context.t3 = _context.sent;

          _context.t2.log.call(_context.t2, "state of gen 0 --> ", _context.t3);

          treasuryWallet = "0x1D5215041824138CB82576e961e10eA350D7ed99";
          systemWallet1 = "0x01135d54F00EF92F289a068C1478478E5c3eECC0";
          systemWallet2 = "0x940B3c799069BfB20902EC298A44F7f20672bcf4";
          depositWallet = "0x7907525d38308AC0cB3dd8D2cb4f44E93Cd2Ec8C";
          atmVault = "0x69E653020C24Ea59890B4c10731A887FF444438D";
          console.log("setting wallet addreses in gamelogic contract...");
          _context.next = 126;
          return regeneratorRuntime.awrap(gameLogic.setAllWallets(treasuryWallet, systemWallet1, systemWallet2, depositWallet, atmVault));

        case 126:
          tx = _context.sent;
          _context.next = 129;
          return regeneratorRuntime.awrap(tx.wait());

        case 129:
          console.log("wallet setting done...");
          fs.writeFileSync("new_configs/config_v7.js", "export const bitFightersAddress = \"".concat(bitFighters.address, "\"\n  export const gameLogicAddress = \"").concat(gameLogic.address, "\"\n  export const testWbtcAddress = \"").concat(testWBTC.address, "\""));

        case 131:
        case "end":
          return _context.stop();
      }
    }
  });
} // We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.


main().then(function () {
  return process.exit(0);
})["catch"](function (error) {
  console.error(error);
  process.exit(1);
});