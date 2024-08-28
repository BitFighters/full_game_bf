// const {
//   expect
// } = require("chai");
// const {
//   ethers
// } = require("hardhat");

// describe("OneKClub", function () {
//   it("Basic", async function () {

//     const addresses = await ethers.getSigners();

//     const TestUSDCContract = await hre.ethers.getContractFactory("UsdcContractERC20");
//     const testUsdc = await TestUSDCContract.deploy();
//     await testUsdc.deployed();
//     console.log("test WBTC deployed to:", testUsdc.address);

//     const OneKClubContract = await hre.ethers.getContractFactory("OneKClubNFT");
//     const onekClub = await OneKClubContract.deploy(
//       "onekClub",
//       "OKC",
//       addresses[5].address,
//       addresses[6].address,
//       addresses[7].address,
//       testUsdc.address
//     );
//     await onekClub.deployed();
//     console.log("onekClub deployed to:", onekClub.address);



//     console.log(await testUsdc.balanceOf(addresses[0].address))
//     await testUsdc.transfer(addresses[1].address, "10000000000")
//     console.log(await testUsdc.balanceOf(addresses[0].address), await testUsdc.balanceOf(addresses[1].address))
//     console.log()

//     let secondAddressSigner = await ethers.getSigner(addresses[1].address)
//     await testUsdc.connect(secondAddressSigner).transfer(addresses[2].address, "10000000")
//     console.log(await testUsdc.balanceOf(addresses[1].address), await testUsdc.balanceOf(addresses[2].address))

//     // fetch how many minted
//     console.log("--total_minted--", await onekClub.getMintedCardsCount())
//     await testUsdc.approve(onekClub.address, "100000000000000")
//     // try to mint
//     await onekClub.mintMultiOnekClubNFTFighters(1)
//     console.log("--total_minted--", await onekClub.getMintedCardsCount(), await onekClub.tokenURI(1))
//     await onekClub.mintMultiOnekClubNFTFighters(2)
//     console.log("--total_minted--", await onekClub.getMintedCardsCount(), await onekClub.tokenURI(2))

//     // lets mint more than 1
//     // let tokenURIs = []
//     // let totalMintCount = 240
//     // for (let i = 1; i <= totalMintCount; i++) {
//     //   tokenURIs.push(`test${i+1}`)
//     // }

//     // await onekClub.mintMultiOnekClubNFTFighters(totalMintCount)
//     // for (let i = 1; i <= totalMintCount; i++) {
//     //   console.log("--uri of --", i + 1, await onekClub.tokenURI(i + 1), addresses[0].address == await onekClub.originalMinters(i + 1))
//     // }
//     // console.log("--total_minted--", await onekClub.getMintedCardsCount())


//     // // now lets test the transfer..
//     // console.log("owner of token 1 ", await onekClub.ownerOf(1), await onekClub.ownerOf(1))
//     // console.log(`balance of system1 
//     //   ${await testUsdc.balanceOf(addresses[5].address)},  
//     //   system2 ->${await testUsdc.balanceOf(addresses[6].address)}, 
//     //   treasury -> ${await testUsdc.balanceOf(addresses[7].address)}`)

//     // await onekClub.transfer(addresses[10].address, 1)

//     // console.log("owner of token 1 ", await onekClub.ownerOf(1), addresses[10].address)
//     // console.log(`balance of system1 
//     //   ${await testUsdc.balanceOf(addresses[5].address)},  
//     //   system2 ->${await testUsdc.balanceOf(addresses[6].address)}, 
//     //   treasury -> ${await testUsdc.balanceOf(addresses[7].address)}`)

//     console.log("--", await onekClub.tokenURI(1))
//     console.log(await onekClub.changeTokenURI("test_1", 1))
//     console.log("--", await onekClub.tokenURI(1))
//     console.log("******************")


//     console.log(await onekClub.fetchOneKCardsForUser(addresses[0].address), await onekClub.fetchOneKCardsForUser(addresses[1].address))
//     console.log(await onekClub.ownerOf(1), await onekClub.ownerOf(2))

//     await onekClub.transfer(addresses[1].address, 1)

//     console.log(await onekClub.fetchOneKCardsForUser(addresses[0].address), await onekClub.fetchOneKCardsForUser(addresses[1].address))
//     console.log(await onekClub.ownerOf(1), await onekClub.ownerOf(2))












//   });
// });