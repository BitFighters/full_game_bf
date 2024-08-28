"use strict";

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
var hre = require("hardhat");

var fs = require("fs");

function main() {
  var systemWallet1, systemWallet2, treasuryWallet, testUSDC, OneKClubContract, oneKClubContract;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          systemWallet1 = "0x01135d54F00EF92F289a068C1478478E5c3eECC0";
          systemWallet2 = "0x941b6ddb7d0CEab7200aFC6b40c6Eec598A15Af7";
          treasuryWallet = "0x1D5215041824138CB82576e961e10eA350D7ed99";
          testUSDC = {
            address: "0x5eaf4e5a908ba87abf3de768cb0da517db45db48"
          };
          _context.next = 6;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("OneKClubNFT"));

        case 6:
          OneKClubContract = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(OneKClubContract.deploy("1K Club", "1KC", systemWallet1, systemWallet2, treasuryWallet, testUSDC.address));

        case 9:
          oneKClubContract = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(oneKClubContract.deployed());

        case 12:
          console.log("OneKClub deployed to:", oneKClubContract.address); // console.log("setting wallet addreses in presale contract...");
          // tx = await oneKClubContract.setTreasuryWalletAddress(treasuryWallet);
          // await tx.wait();
          // tx = await oneKClubContract.setSystemWalletAddress(systemWallet);
          // await tx.wait();
          // tx = await oneKClubContract.setUSDCContractERC20(testUSDC.address);
          // await tx.wait();
          // console.log("wallet setting done...");
          // allow game contract to use wbtc from depositWallet

          fs.writeFileSync("new_configs/test_oneK_club_contract_address_scale.js", "export const test_oneK_club_contract_address = \"".concat(oneKClubContract.address, "\""));

        case 14:
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