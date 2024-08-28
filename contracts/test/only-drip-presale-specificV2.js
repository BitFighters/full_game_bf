// const {
//   expect
// } = require("chai");
// const {
//   ethers
// } = require("hardhat");

// describe("BitFighters_Presale", function () {
//   it("Basic", async function () {

//     const addresses = await ethers.getSigners();

// const PreSaleContractV2 = await hre.ethers.getContractFactory("PreSaleDripMintNFTV2");
// const presaleV2 = await PreSaleContractV2.deploy("PresaleDripV2", "PSBFDV2");
// await presaleV2.deployed();
// console.log("presaleV2 deployed to:", presaleV2.address);

//     //
//     const TestWBTCContract = await hre.ethers.getContractFactory("TestBits");
//     const testWBTC = await TestWBTCContract.deploy();
//     await testWBTC.deployed();
//     console.log("test WBTC deployed to:", testWBTC.address);

//     // transfer-testing some money to account2 and try to mint bitfighter
//     console.log(await testWBTC.balanceOf(addresses[0].address))
//     await testWBTC.transfer(addresses[1].address, "10000000000")
//     console.log(await testWBTC.balanceOf(addresses[0].address))
//     console.log(await testWBTC.balanceOf(addresses[1].address))

//     let secondAddressSigner = await ethers.getSigner(addresses[1].address)
//     let thirdAddressSigner = await ethers.getSigner(addresses[2].address)
//     await testWBTC.connect(secondAddressSigner).transfer(addresses[2].address, "10000000")
//     console.log(await testWBTC.balanceOf(addresses[1].address), await testWBTC.balanceOf(addresses[2].address))

//     tx = await presaleV2.setTreasuryWalletAddress(addresses[5].address);
//     await tx.wait();


//     tx = await presaleV2.setSystemWalletAddress1(addresses[7].address);
//     await tx.wait();

//     tx = await presaleV2.setSystemWalletAddress2(addresses[11].address);
//     await tx.wait();

//     tx = await presaleV2.setWbtcContract(testWBTC.address);
//     await tx.wait();

//     console.log("setting done for presalev2")

//     console.log("######################################### NOW TESTING MINTING WITH MINTCARDS ###########")
//     console.log(await presaleV2.fetchPreSaleCardsOfUser(addresses[1].address))

//     await testWBTC.connect(secondAddressSigner).approve(presaleV2.address, "10000000000000000")
//     await presaleV2.connect(secondAddressSigner).mintMultiPresaleDripBitfighterCard(["https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-abf60569-708a-4f84-9beb-1fa3d3d7c93f-metadata.json"], addresses[18].address, false, false)
//     // let b1 = await testWBTC.balanceOf(addresses[5].address)
//     // let b2 = await testWBTC.balanceOf(addresses[7].address)
//     // console.log(b1, b2)

//     await presaleV2.connect(secondAddressSigner).mintMultiPresaleDripBitfighterCard(["https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-abf60569-708a-4f84-9beb-1fa3d3d7c93f-metadata.json"], addresses[18].address, false, true)
//     // let b3 = await testWBTC.balanceOf(addresses[5].address)
//     // let b4 = await testWBTC.balanceOf(addresses[7].address)
//     // console.log(b3, b4, b3 - b1, b4 - b2)

//     await presaleV2.connect(secondAddressSigner).mintMultiPresaleDripBitfighterCard(["https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-abf60569-708a-4f84-9beb-1fa3d3d7c93f-metadata.json"], addresses[18].address, true, false)
//     // console.log(await testWBTC.balanceOf(addresses[5].address), await testWBTC.balanceOf(addresses[7].address))

//     await presaleV2.connect(secondAddressSigner).mintMultiPresaleDripBitfighterCard(["https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-abf60569-708a-4f84-9beb-1fa3d3d7c93f-metadata.json"], addresses[18].address, true, true)
//     // console.log(await testWBTC.balanceOf(addresses[5].address), await testWBTC.balanceOf(addresses[7].address))
//     console.log("so, i bought two presale cards ", await presaleV2.fetchPreSaleCardsOfUser(addresses[1].address))
//     console.log(await presaleV2.tokenURI(1), await presaleV2.tokenURI(2))


//     await testWBTC.connect(thirdAddressSigner).approve(presaleV2.address, "10000000")
//     await presaleV2.connect(thirdAddressSigner).mintMultiPresaleDripBitfighterCard(["https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-abf60569-708a-4f84-9beb-1fa3d3d7c93f-metadata.json"], addresses[18].address, true, true)


//     console.log("so, i bought two presale cards ", await presaleV2.fetchPreSaleCardsOfUser(addresses[2].address))
//     console.log(await presaleV2.ownerOf(5), thirdAddressSigner.address)

//     await presaleV2.connect(secondAddressSigner).transfer(addresses[18].address, 1)

//     console.log("so, i bought two presale cards ", await presaleV2.fetchPreSaleCardsOfUser(addresses[18].address))
//     console.log(await presaleV2.ownerOf(1), addresses[18].address)





//     // testing airdrop 
//     // console.log("so,  check pmint cards for user 3 ", await presaleV2.fetchPreSaleCardsOfUser(addresses[3].address))
//     // await presaleV2.mintPreSaleBitfighterCardAdmin("airdrop", addresses[3].address)
//     // console.log("so,  check pmint cards for user 3 ", await presaleV2.fetchPreSaleCardsOfUser(addresses[3].address), await presaleV2.mintedIdToReferrerAddressMapping(3))

//     // let fourthAddressSigner = await ethers.getSigner(addresses[3].address)
//     // await presaleV2.connect(fourthAddressSigner).changeReferrerAddress(3, addresses[18].address)
//     // console.log("so,  check pmint cards for user 3 ", await presaleV2.fetchPreSaleCardsOfUser(addresses[3].address), await presaleV2.mintedIdToReferrerAddressMapping(3))

//   });
// });