// const {
//   expect
// } = require("chai");
// const {
//   ethers
// } = require("hardhat");

// describe("GameLogic", function () {
//   it("PartnersTest", async function () {

//     const addresses = await ethers.getSigners();


//     const GameLogicContract = await hre.ethers.getContractFactory("GameLogic");
//     const gameLogic = await GameLogicContract.deploy();
//     await gameLogic.deployed();
//     console.log("GameLogic deployed to:", gameLogic.address);


//     let partnersNames = await gameLogic.fetchAllNamesOfPartners()
//     let partnersAddresses = await gameLogic.fetchAllAddressOfPartners()

//     console.log(partnersAddresses, partnersNames)


//     // adding partner
//     // console.log("------------------ADDING_PARTNER-------------------")
//     await gameLogic.addPartners("drip", addresses[1].address, 0)

//     // console.log("------------------FETCHING_PARTNERS-------------------")
//     console.log(await gameLogic.fetchAllNamesOfPartners(), await gameLogic.fetchAllAddressOfPartners())

//     // adding partner
//     console.log("------------------ADDING_PARTNER-------------------")
//     await gameLogic.addPartners("newpartner", addresses[2].address, 1000)

//     console.log("------------------FETCHING_PARTNERS-------------------")
//     console.log(await gameLogic.fetchAllNamesOfPartners(), await gameLogic.fetchAllAddressOfPartners())

//     // removing partner
//     console.log("------------------REMOVING_PARTNER-------------------")
//     await gameLogic.removePartner("drip")

//     console.log("------------------FETCHING_PARTNERS-------------------")
//     console.log(await gameLogic.fetchAllNamesOfPartners(), await gameLogic.fetchAllAddressOfPartners())

//     console.log(await gameLogic.fetchPartnersInfo("newpartner"))






//   });
// });