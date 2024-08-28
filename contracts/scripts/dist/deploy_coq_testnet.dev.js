"use strict";

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
var hre = require("hardhat");

var fs = require("fs");

function main() {
  var CoqPusherContract, CoqPusher, TestCOQContract, testCOQ, treasuryWallet, systemWallet1, systemWallet2, depositWallet, atmVault;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("CoqPusher"));

        case 2:
          CoqPusherContract = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(CoqPusherContract.deploy());

        case 5:
          CoqPusher = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(CoqPusher.deployed());

        case 8:
          console.log("CoqPusher deployed to:", CoqPusher.address);
          _context.next = 11;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("TestCOQ"));

        case 11:
          TestCOQContract = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(TestCOQContract.deploy());

        case 14:
          testCOQ = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(testCOQ.deployed());

        case 17:
          console.log("test COQ deployed to:", testCOQ.address);
          _context.next = 20;
          return regeneratorRuntime.awrap(CoqPusher.setCOQContract(testCOQ.address));

        case 20:
          tx = _context.sent;
          _context.next = 23;
          return regeneratorRuntime.awrap(tx.wait());

        case 23:
          treasuryWallet = "0x1D5215041824138CB82576e961e10eA350D7ed99";
          systemWallet1 = "0x01135d54F00EF92F289a068C1478478E5c3eECC0";
          systemWallet2 = "0x940B3c799069BfB20902EC298A44F7f20672bcf4";
          depositWallet = "0x7907525d38308AC0cB3dd8D2cb4f44E93Cd2Ec8C";
          atmVault = "0x69E653020C24Ea59890B4c10731A887FF444438D";
          console.log("setting wallet addreses in CoqPusher contract...");
          _context.next = 31;
          return regeneratorRuntime.awrap(CoqPusher.setAllWallets( // treasuryWallet,
          systemWallet1, systemWallet2, depositWallet, atmVault));

        case 31:
          tx = _context.sent;
          _context.next = 34;
          return regeneratorRuntime.awrap(tx.wait());

        case 34:
          console.log("wallet setting done..."); // allow game contract to use wbtc from depositWallet

          fs.writeFileSync("new_configs/coq_test.js", "export const CoqPusherAddress = \"".concat(CoqPusher.address, "\"\n    export const testCOQAddress = \"").concat(testCOQ.address, "\""));

        case 36:
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