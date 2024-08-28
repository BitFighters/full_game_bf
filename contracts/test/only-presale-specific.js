// const {
//   expect
// } = require("chai");
// const {
//   ethers
// } = require("hardhat");

// describe("BitFighters_Presale", function () {
//   it("Basic", async function () {

//     const addresses = await ethers.getSigners();

//     // deploy bitfighters..
//     const BitFighters = await hre.ethers.getContractFactory("BitFightersNFT");
//     const bitFighters = await BitFighters.deploy("BitFighters", "BF");
//     await bitFighters.deployed();
//     console.log("Bitfighters deployed to:", bitFighters.address);

//     //
//     const GameLogicContract = await hre.ethers.getContractFactory("GameLogic");
//     const gameLogic = await GameLogicContract.deploy();
//     await gameLogic.deployed();
//     console.log("GameLogic deployed to:", gameLogic.address);

// const PreSaleContractV2 = await hre.ethers.getContractFactory("PreSaleMintNFTV2");
// const presaleV2 = await PreSaleContractV2.deploy("PresaleV2", "PSBFV2");
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
//     await testWBTC.connect(secondAddressSigner).transfer(addresses[2].address, "10000000")
//     console.log(await testWBTC.balanceOf(addresses[1].address), await testWBTC.balanceOf(addresses[2].address))

//     // 

//     let tx = await bitFighters.setPriceOfGenN(1000, 0);
//     await tx.wait();

//     tx = await bitFighters.setNumberOfNFTsLimitForGenN(10, 0);
//     await tx.wait();

//     tx = await bitFighters.changeMinitngState(true);
//     await tx.wait();

//     tx = await bitFighters.setGameLogicContract(gameLogic.address);
//     await tx.wait();

//     tx = await bitFighters.setMintCardContract(presaleV2.address);
//     await tx.wait();

//     console.log("price of gen 0 --> ", await bitFighters.priceOfGenNBitFighters(0))
//     console.log("limit of gen 0 --> ", await bitFighters.limitCountOfGenNBitfighters(0))
//     console.log("state of gen 0 --> ", await bitFighters.readyToMint())

//     console.log("setting wallet addreses in gamelogic contract...");
//     tx = await gameLogic.setTreasuryWallet(addresses[5].address);
//     await tx.wait();

//     tx = await gameLogic.setJackpotWallet(addresses[6].address);
//     await tx.wait();

//     tx = await gameLogic.setSystemWallet1(addresses[7].address);
//     await tx.wait();

//     tx = await gameLogic.setSystemWallet2(addresses[11].address);
//     await tx.wait();

//     tx = await gameLogic.setDepositWallet(addresses[8].address);
//     await tx.wait();

//     tx = await gameLogic.setPrizeWallet(addresses[9].address);
//     await tx.wait();

//     tx = await gameLogic.setWbtcContract(testWBTC.address);
//     await tx.wait();

//     tx = await gameLogic.setBitFightersContract(bitFighters.address);
//     await tx.wait();

//     console.log("wallet setting done...");


//     tx = await presaleV2.setTreasuryWalletAddress(addresses[5].address);
//     await tx.wait();


//     tx = await presaleV2.setSystemWalletAddress1(addresses[7].address);
//     await tx.wait();

//     tx = await presaleV2.setSystemWalletAddress2(addresses[11].address);
//     await tx.wait();

//     tx = await presaleV2.setWbtcContract(testWBTC.address);
//     await tx.wait();

//     // tx = await presaleV2.setBitfighterContractAddress(bitFighters.address);
//     // await tx.wait();


//     console.log("setting done for presalev2")

//     // allow game logic contract to use wbtc erc20 from address1
//     await testWBTC.connect(secondAddressSigner).approve(gameLogic.address, "1000000000000000")
//     console.log("---------- approved game logic contract")
//     // now buy bitfighter with addr1
//     console.log("---------- minting--- balance of trasury wallet ", await testWBTC.balanceOf(addresses[5].address), await testWBTC.balanceOf(addresses[13].address))
//     await bitFighters.connect(secondAddressSigner).mintBitFighter("abc", addresses[2].address, 12, "hero", 0, "")

//     console.log(addresses[1].address, await bitFighters.ownerOf(1))

//     console.log("------------------FETCHING_PARTNERS-------------------")
//     console.log(await gameLogic.fetchAllNamesOfPartners(), await gameLogic.fetchAllAddressOfPartners())

//     console.log("---------- after minting--- balance of trasury wallet ", await testWBTC.balanceOf(addresses[5].address), await testWBTC.balanceOf(addresses[13].address))
//     await gameLogic.addPartners("drip", addresses[13].address)


//     console.log("------------------FETCHING_PARTNERS-------------------")
//     console.log(await gameLogic.fetchAllNamesOfPartners(), await gameLogic.fetchAllAddressOfPartners())

//     console.log("---------- minting--- balance of trasury wallet ", await testWBTC.balanceOf(addresses[5].address), await testWBTC.balanceOf(addresses[13].address))
//     await bitFighters.connect(secondAddressSigner).mintBitFighter("abc", addresses[2].address, 12, "hero", 0, "drip")
//     // console.log(addresses[1].address, await bitFighters.ownerOf(1), await bitFighters.nftIdToExtraInfoMapping(2))

//     console.log("---------- after minting--- balance of trasury wallet ", await testWBTC.balanceOf(addresses[5].address), await testWBTC.balanceOf(addresses[13].address))

//     console.log("---------- check tokens of user-- ", await bitFighters.getTokensOfUser(addresses[1].address))

//     console.log("---------- get extra info -- ", await bitFighters.getTokensOfUser(addresses[1].address), await bitFighters.nftIdToExtraInfoMapping(1))
//     await bitFighters.connect(secondAddressSigner).setRefererForBitfighter(1, addresses[18].address)

//     console.log("---------- get extra info -- ", await bitFighters.nftIdToExtraInfoMapping(1))


//     console.log("######################################### NOW TESTING MINTING WITH MINTCARDS ###########")
//     console.log(await presaleV2.fetchPreSaleCardsOfUser(addresses[1].address))

//     await testWBTC.connect(secondAddressSigner).approve(presaleV2.address, "10000000000000000")
//     await presaleV2.connect(secondAddressSigner).mintMultiPresaleBitfighterCard(["abcd"], addresses[18].address)
//     await presaleV2.connect(secondAddressSigner).mintMultiPresaleBitfighterCard(["abcde"], addresses[18].address)

//     console.log("so, i bought two presale cards ", await presaleV2.fetchPreSaleCardsOfUser(addresses[1].address))
//     console.log(await presaleV2.tokenURI(1), await presaleV2.tokenURI(2))

//     await bitFighters.connect(secondAddressSigner).mintBitFighterMitCard("mint_with_mintcard_1", addresses[18].address, 10, "abcd", 0)
//     console.log("so,  remaining presale cards ", await presaleV2.fetchPreSaleCardsOfUser(addresses[1].address))

//     await bitFighters.connect(secondAddressSigner).mintBitFighterMitCard("mint_with_mintcard_2", addresses[18].address, 10, "abcde", 0)
//     console.log("so,  remaining presale cards ", await presaleV2.fetchPreSaleCardsOfUser(addresses[1].address))


//     // testing airdrop 
//     console.log("so,  check pmint cards for user 3 ", await presaleV2.fetchPreSaleCardsOfUser(addresses[3].address))
//     await presaleV2.mintPreSaleBitfighterCardAdmin("airdrop", addresses[3].address)
//     console.log("so,  check pmint cards for user 3 ", await presaleV2.fetchPreSaleCardsOfUser(addresses[3].address), await presaleV2.mintedIdToReferrerAddressMapping(3))

//     let fourthAddressSigner = await ethers.getSigner(addresses[3].address)
//     await presaleV2.connect(fourthAddressSigner).changeReferrerAddress(3, addresses[18].address)
//     console.log("so,  check pmint cards for user 3 ", await presaleV2.fetchPreSaleCardsOfUser(addresses[3].address), await presaleV2.mintedIdToReferrerAddressMapping(3))


//     // test the burning
//     console.log(
//       "so, print the bf cards of user1 ",
//       // await bitFighters.getTokensOfUser(addresses[0].address),
//       await bitFighters.getTokensOfUser(addresses[1].address),
//       // await bitFighters.nftIdToExtraInfoMapping(1),
//       await bitFighters.originalMinters(1),
//       await bitFighters.getTokensOfUser(addresses[2].address),
//       // await bitFighters.getTokensOfUser(addresses[3].address)
//     )

//     // burn one card
//     await bitFighters.burn(1)

//     console.log(
//       "so, print the bf cards of user1 ",
//       // await bitFighters.getTokensOfUser(addresses[0].address),
//       await bitFighters.getTokensOfUser(addresses[1].address),
//       // await bitFighters.nftIdToExtraInfoMapping(1),
//       await bitFighters.originalMinters(1),
//       await bitFighters.getTokensOfUser(addresses[2].address),
//       await bitFighters.ownerOf(2)
//     )
//     console.log()


//     await bitFighters.connect(secondAddressSigner).transfer(addresses[2].address, 2)

//     console.log(
//       "so, print the bf cards of user1 ",
//       await bitFighters.getTokensOfUser(addresses[1].address),
//       await bitFighters.getTokensOfUser(addresses[2].address),
//       addresses[2].address == await bitFighters.ownerOf(2)
//     )


//   });
// });