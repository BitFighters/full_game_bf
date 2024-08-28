const {
  expect
} = require("chai");
const {
  ethers
} = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("BitFighters_ALL_TESTING", function () {

  async function deployAllCOntracts() {
    const [owner, addr1, addr2, addr3, treasuryWallet, sys1Wallet, sys2Wallet, prizePoolWallet, jackPotWallet, depositWallet, dripPartnerWallet, atmVault] = await ethers.getSigners();
    const BitFighters = await hre.ethers.getContractFactory("BitFightersNFT");
    const bitFighters = await BitFighters.deploy("BitFighters", "BF");
    await bitFighters.deployed();
    console.log("Bitfighters deployed to:", bitFighters.address);

    const GameLogicContract = await hre.ethers.getContractFactory("GameLogic");
    const gameLogic = await GameLogicContract.deploy();
    await gameLogic.deployed();
    console.log("GameLogic deployed to:", gameLogic.address);

    const TestWBTCContract = await hre.ethers.getContractFactory("TestBits");
    const testWBTC = await TestWBTCContract.deploy();
    await testWBTC.deployed();
    console.log("test WBTC deployed to:", testWBTC.address);

    const PreSaleContractV2 = await hre.ethers.getContractFactory("PreSaleMintNFTV2");
    const presaleV2 = await PreSaleContractV2.deploy("PresaleV2", "PSBFV2", treasuryWallet.address, sys1Wallet.address, sys2Wallet.address);
    await presaleV2.deployed();
    console.log("presaleV2 deployed to:", presaleV2.address);

    const PreSaleContractV2Drip = await hre.ethers.getContractFactory("PreSaleDripMintNFTV2");
    const presaleV2Drip = await PreSaleContractV2Drip.deploy("PresaleDripV2", "PSBFDV2");
    await presaleV2Drip.deployed();
    console.log("presaleDripV2 deployed to:", presaleV2Drip.address);

    // steps for bf contract
    // let tx = await bitFighters.setPriceOfGenN(1000, 0);
    // await tx.wait();

    tx = await bitFighters.setNumberOfNFTsLimitForGenN(100, 0);
    await tx.wait();

    tx = await bitFighters.changeMinitngState(true);
    await tx.wait();

    tx = await bitFighters.setGameLogicContract(gameLogic.address);
    await tx.wait();

    tx = await bitFighters.setMintCardContract(presaleV2.address);
    await tx.wait();

    // tx = await bitFighters.setLaunchPartnerMintCardContract(presaleV2Drip.address);
    // await tx.wait();

    // steps for game logic

    console.log("setting wallet addreses in gamelogic contract...");
    tx = await gameLogic.setAllWallets(
      treasuryWallet.address,
      sys1Wallet.address,
      sys2Wallet.address,
      depositWallet.address,
      atmVault.address
    );
    // tx = await gameLogic.setTreasuryWallet(treasuryWallet.address);
    // await tx.wait();

    // tx = await gameLogic.setJackpotWallet(jackPotWallet.address);
    // await tx.wait();

    // tx = await gameLogic.setSystemWallet1(sys1Wallet.address);
    // await tx.wait();

    // tx = await gameLogic.setSystemWallet2(sys2Wallet.address);
    // await tx.wait();

    // tx = await gameLogic.setDepositWallet(depositWallet.address);
    // await tx.wait();

    // tx = await gameLogic.setPrizeWallet(prizePoolWallet.address);
    // await tx.wait();

    tx = await gameLogic.setBtcbContract(testWBTC.address);
    await tx.wait();

    tx = await gameLogic.setBitFightersContract(bitFighters.address);
    await tx.wait();

    console.log("wallet setting done...");


    tx = await presaleV2.setTreasuryWalletAddress(treasuryWallet.address);
    await tx.wait();

    tx = await presaleV2.setSystemWalletAddress1(sys1Wallet.address);
    await tx.wait();

    tx = await presaleV2.setSystemWalletAddress2(sys2Wallet.address);
    await tx.wait();

    tx = await presaleV2.setWbtcContract(testWBTC.address);
    await tx.wait();

    // tx = await presaleV2.setBitfighterContractAddress(bitFighters.address);
    // await tx.wait();

    console.log("setting done for presalev2")

    tx = await presaleV2Drip.setTreasuryWalletAddress(treasuryWallet.address);
    await tx.wait();

    tx = await presaleV2Drip.setSystemWalletAddress1(sys1Wallet.address);
    await tx.wait();

    tx = await presaleV2Drip.setSystemWalletAddress2(sys2Wallet.address);
    await tx.wait();

    tx = await presaleV2Drip.setWbtcContract(testWBTC.address);
    await tx.wait();

    tx = await presaleV2Drip.setDripPartnerWallet(dripPartnerWallet.address);
    await tx.wait();

    console.log("setting done for drip presalev2 ") // console.log(owner.address)


    // Fixtures can return anything you consider useful for your tests
    return {
      contracts: {
        bitFighters,
        gameLogic,
        testWBTC,
        presaleV2,
        presaleV2Drip
      },
      addresses: {
        owner,
        addr1,
        addr2,
        addr3,
        prizePoolWallet,
        treasuryWallet,
        sys1Wallet,
        sys2Wallet,
        jackPotWallet,
        depositWallet,
        atmVault,
      }
    };
  }

  it("normal_pre_mint_testing", async function () {
    const {
      addresses,
      contracts
    } = await loadFixture(deployAllCOntracts);

    console.log("balance of owner in wbtc ", await contracts.testWBTC.balanceOf(addresses.owner.address))

    // share money two other users. so that they can buy pre mint cards.
    await contracts.testWBTC.transfer(addresses.addr1.address, "100000000")
    await contracts.testWBTC.transfer(addresses.addr2.address, "100000000")
    await contracts.testWBTC.transfer(addresses.addr3.address, "100000000")
    // check balance of all
    console.log("balance of all users in wbtc ",
      await contracts.testWBTC.balanceOf(addresses.owner.address),
      await contracts.testWBTC.balanceOf(addresses.addr1.address),
      await contracts.testWBTC.balanceOf(addresses.addr2.address),
      await contracts.testWBTC.balanceOf(addresses.addr3.address)
    )

    //  make them buy mitn cards.
    console.log("user 1 --- approve presale contract ..", addresses.addr1.address)
    await contracts.testWBTC.connect(addresses.addr1).approve(contracts.presaleV2.address, "1000000000000000")
    await contracts.presaleV2.connect(addresses.addr1).mintMultiPresaleBitfighterCard(["addr1_1", "addr1_2"], addresses.sys1Wallet.address);
    console.log("mint card minted by user 1")
    let tokensOwnedByUser1 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr1.address);
    console.log(tokensOwnedByUser1)
    for (let i = 0; i < tokensOwnedByUser1.length; i++) {
      console.log(tokensOwnedByUser1[i], "---", await contracts.presaleV2.ownerOf(tokensOwnedByUser1[i]), await contracts.presaleV2.tokenURI(tokensOwnedByUser1[i]))
    }
    // console.log(await contracts.presaleV2.getMintedCouponsCount(), await contracts.presaleV2.ownerOf(1), await contracts.presaleV2.ownerOf(2), await contracts.presaleV2.tokenURI(1), await contracts.presaleV2.tokenURI(2))

    // make user 2 buy now..
    console.log("user 2 --- approve presale contract ..", addresses.addr2.address)
    await contracts.testWBTC.connect(addresses.addr2).approve(contracts.presaleV2.address, "1000000000000000")
    await contracts.presaleV2.connect(addresses.addr2).mintMultiPresaleBitfighterCard(["addr2_1", "addr2_2"], addresses.sys1Wallet.address);
    console.log("mint card minted by user 2")
    let tokensOwnedByUser2 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr2.address);
    console.log(tokensOwnedByUser2)
    for (let i = 0; i < tokensOwnedByUser2.length; i++) {
      console.log(tokensOwnedByUser2[i], "---", await contracts.presaleV2.ownerOf(tokensOwnedByUser2[i]), await contracts.presaleV2.tokenURI(tokensOwnedByUser2[i]))
    }

    // now let them exchange one mint card -> user 1 transfers to user 2
    console.log("------=------ exchange ----------", addresses.addr1.address, addresses.addr2.address)
    await contracts.presaleV2.connect(addresses.addr1).transferFrom(addresses.addr1.address, addresses.addr2.address, 1)
    tokensOwnedByUser2 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr2.address);
    console.log(tokensOwnedByUser2)
    for (let i = 0; i < tokensOwnedByUser2.length; i++) {
      console.log("user 2", tokensOwnedByUser2[i], "---", await contracts.presaleV2.ownerOf(tokensOwnedByUser2[i]), await contracts.presaleV2.tokenURI(tokensOwnedByUser2[i]), "original minter ... ", await contracts.presaleV2.originalMinters(tokensOwnedByUser2[i]))
    }

    tokensOwnedByUser1 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr1.address);
    console.log(tokensOwnedByUser1)
    for (let i = 0; i < tokensOwnedByUser1.length; i++) {
      console.log("user 1", tokensOwnedByUser1[i], "---", await contracts.presaleV2.ownerOf(tokensOwnedByUser1[i]), await contracts.presaleV2.tokenURI(tokensOwnedByUser1[i]), "original minter ... ", await contracts.presaleV2.originalMinters(tokensOwnedByUser1[i]))
    }

    console.log("exchange done --------")

    await contracts.gameLogic.addPackInfo(5, 1000)

    console.log("try to mint a bf with user 2")
    await contracts.testWBTC.connect(addresses.addr1).approve(contracts.gameLogic.address, "1000000000000000")
    await contracts.testWBTC.connect(addresses.addr2).approve(contracts.gameLogic.address, "1000000000000000")
    // this will work fine..
    await contracts.bitFighters.connect(addresses.addr1).mintMultiBitfighter(["abc", "", "", "", ""], addresses.sys1Wallet.address, 0, "", false)
    await contracts.bitFighters.connect(addresses.addr1).mintMultiBitfighter(["abcd", "", "", "", ""], addresses.sys1Wallet.address, 0, "", false)
    await contracts.bitFighters.connect(addresses.addr2).mintMultiBitfighter(["abcde", "", "", "", ""], addresses.sys1Wallet.address, 0, "", false)
    console.log("try to mint a bf with user 2 done")

    // tokensOwnedByUser1 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr1.address);
    // console.log(tokensOwnedByUser1)

    let bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1", bitfightersOfUser1)
    // for (let i = 0; i < bitfightersOfUser1.length; i++) {
    //   console.log("--------------------", await contracts.bitFighters.getAllInfoOfBitfighter(bitfightersOfUser1[i]))
    // }

    // but this wont work fine.. 
    // just like this. because of unauthorized error.
    // we wil have to set the bf contract address in mint contract.
    // await contracts.bitFighters.connect(addresses.addr1).mintBitFighterMitCard("abc", addresses.sys1Wallet.address, 12, "hero", 0);

    // 
    tokensOwnedByUser1 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr1.address);
    console.log("**", tokensOwnedByUser1)

    await contracts.presaleV2.setBitfighterContractAddress(contracts.bitFighters.address);
    await contracts.bitFighters.connect(addresses.addr1).mintBitFighterWithMitCard(["abcde"], 0);

    bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1 ", bitfightersOfUser1)

    let bitfightersOfUser2 = await contracts.bitFighters.getTokensOfUser(addresses.addr2.address);
    console.log("bitfighters owned by user2 ", bitfightersOfUser2)

    tokensOwnedByUser1 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr1.address);
    console.log("******", tokensOwnedByUser1)

    console.log("--------- transfer of bf and check ------------")
    await contracts.bitFighters.connect(addresses.addr1).transferFrom(addresses.addr1.address, addresses.addr2.address, 1)

    bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1 ", bitfightersOfUser1)

    bitfightersOfUser2 = await contracts.bitFighters.getTokensOfUser(addresses.addr2.address);
    console.log("bitfighters owned by user2 ", bitfightersOfUser2)

    await contracts.bitFighters.connect(addresses.addr1).setRefererForBitfighter(2, addresses.addr2.address)

    bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1", bitfightersOfUser1)

    console.log("---", await contracts.presaleV2.getMintedCouponsCount())
    await contracts.presaleV2.mintPreSaleBitfighterCardAdmin(["abcdef"], addresses.addr3.address)
    // await contracts.presaleV2.mintPreSaleBitfighterCardAdmin("abcdefg", addresses.addr2.address)
    // await contracts.presaleV2.mintPreSaleBitfighterCardAdmin("abcdefh", addresses.addr3.address)
    console.log("---", await contracts.presaleV2.getMintedCouponsCount())


    // 
    console.log("-------------staking------------")
    await contracts.bitFighters.connect(addresses.depositWallet).setApprovalForAll(contracts.gameLogic.address, true)
    await contracts.bitFighters.connect(addresses.addr1).approve(contracts.gameLogic.address, 2)
    await contracts.gameLogic.connect(addresses.addr1).stakeNFT(2)
    console.log('*************************************************')
    await contracts.bitFighters.connect(addresses.addr1).approve(contracts.gameLogic.address, 3)
    await contracts.gameLogic.connect(addresses.addr1).stakeNFT(3)
    console.log('*********************-----------****************************')
    bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1 -----------", bitfightersOfUser1)

    console.log('*******************&&&&&&&&&&&&&&&&******************************', contracts.gameLogic.address)

    await contracts.gameLogic.releaseNFT(addresses.addr1.address, 3)
    bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1 -----------", bitfightersOfUser1)

    await contracts.gameLogic.releaseNFT(addresses.addr1.address, 2)
    bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
    console.log("bitfighters owned by user1 -----------", bitfightersOfUser1)

    // tokensOwnedByUser2 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr2.address);
    // console.log("**************", tokensOwnedByUser2)

    // await contracts.bitFighters.connect(addresses.addr2).mintBitFighterMitCard("abcd", 12, "hero", 0)

    // tokensOwnedByUser2 = await contracts.presaleV2.fetchPreSaleCardsOfUser(addresses.addr2.address);
    // console.log("**************", tokensOwnedByUser2)


  });

  // it("drip_mint_testing", async function () {
  //   const {
  //     addresses,
  //     contracts
  //   } = await loadFixture(deployAllCOntracts);

  //   console.log("balance of owner in wbtc ", await contracts.testWBTC.balanceOf(addresses.owner.address))

  //   // share money two other users. so that they can buy pre mint cards.
  //   await contracts.testWBTC.transfer(addresses.addr1.address, "100000000")
  //   await contracts.testWBTC.transfer(addresses.addr2.address, "100000000")
  //   await contracts.testWBTC.transfer(addresses.addr3.address, "100000000")
  //   // check balance of all
  //   console.log("balance of all users in wbtc ",
  //     await contracts.testWBTC.balanceOf(addresses.owner.address),
  //     await contracts.testWBTC.balanceOf(addresses.addr1.address),
  //     await contracts.testWBTC.balanceOf(addresses.addr2.address),
  //     await contracts.testWBTC.balanceOf(addresses.addr3.address)
  //   )

  //   //  make them buy mitn cards.
  //   console.log("user 1 --- approve presale contract ..", addresses.addr1.address)
  //   await contracts.testWBTC.connect(addresses.addr1).approve(contracts.presaleV2Drip.address, "1000000000000000")
  //   await contracts.presaleV2Drip.connect(addresses.addr1).mintMultiPresaleDripBitfighterCard(["addr1_1", "addr1_2"], addresses.sys1Wallet.address, false, false);
  //   console.log("mint card minted by user 1")
  //   let tokensOwnedByUser1 = await contracts.presaleV2Drip.fetchPreSaleCardsOfUser(addresses.addr1.address);
  //   console.log(tokensOwnedByUser1)
  //   for (let i = 0; i < tokensOwnedByUser1.length; i++) {
  //     console.log(tokensOwnedByUser1[i], "---", await contracts.presaleV2Drip.ownerOf(tokensOwnedByUser1[i]), await contracts.presaleV2Drip.tokenURI(tokensOwnedByUser1[i]))
  //   }
  //   // console.log(await contracts.presaleV2Drip.getMintedCouponsCount(), await contracts.presaleV2Drip.ownerOf(1), await contracts.presaleV2Drip.ownerOf(2), await contracts.presaleV2Drip.tokenURI(1), await contracts.presaleV2Drip.tokenURI(2))

  //   // make user 2 buy now..
  //   console.log("user 2 --- approve presale contract ..", addresses.addr2.address)
  //   await contracts.testWBTC.connect(addresses.addr2).approve(contracts.presaleV2Drip.address, "1000000000000000")
  //   await contracts.presaleV2Drip.connect(addresses.addr2).mintMultiPresaleDripBitfighterCard(["addr2_1", "addr2_2"], addresses.sys1Wallet.address, false, false);
  //   console.log("mint card minted by user 2")
  //   let tokensOwnedByUser2 = await contracts.presaleV2Drip.fetchPreSaleCardsOfUser(addresses.addr2.address);
  //   console.log(tokensOwnedByUser2)
  //   for (let i = 0; i < tokensOwnedByUser2.length; i++) {
  //     console.log(tokensOwnedByUser2[i], "---", await contracts.presaleV2Drip.ownerOf(tokensOwnedByUser2[i]), await contracts.presaleV2Drip.tokenURI(tokensOwnedByUser2[i]))
  //   }

  //   // now let them exchange one mint card -> user 1 transfers to user 2
  //   console.log("------=------ exchange ----------", addresses.addr1.address, addresses.addr2.address)
  //   await contracts.presaleV2Drip.connect(addresses.addr1).transferFrom(addresses.addr1.address, addresses.addr2.address, 1)
  //   tokensOwnedByUser2 = await contracts.presaleV2Drip.fetchPreSaleCardsOfUser(addresses.addr2.address);
  //   console.log(tokensOwnedByUser2)
  //   for (let i = 0; i < tokensOwnedByUser2.length; i++) {
  //     console.log("user 2", tokensOwnedByUser2[i], "---", await contracts.presaleV2Drip.ownerOf(tokensOwnedByUser2[i]), await contracts.presaleV2Drip.tokenURI(tokensOwnedByUser2[i]), "original minter ... ", await contracts.presaleV2Drip.originalMinters(tokensOwnedByUser2[i]))
  //   }

  //   tokensOwnedByUser1 = await contracts.presaleV2Drip.fetchPreSaleCardsOfUser(addresses.addr1.address);
  //   console.log(tokensOwnedByUser1)
  //   for (let i = 0; i < tokensOwnedByUser1.length; i++) {
  //     console.log("user 1", tokensOwnedByUser1[i], "---", await contracts.presaleV2Drip.ownerOf(tokensOwnedByUser1[i]), await contracts.presaleV2Drip.tokenURI(tokensOwnedByUser1[i]), "original minter ... ", await contracts.presaleV2Drip.originalMinters(tokensOwnedByUser1[i]))
  //   }

  //   console.log("exchange done --------")

  //   console.log("try to mint a bf with user 2")
  //   await contracts.testWBTC.connect(addresses.addr1).approve(contracts.gameLogic.address, "1000000000000000")
  //   await contracts.testWBTC.connect(addresses.addr2).approve(contracts.gameLogic.address, "1000000000000000")
  //   // this will work fine..
  //   await contracts.bitFighters.connect(addresses.addr1).mintMultiBitfighter(["abc"], addresses.sys1Wallet.address, 0, "", false, false)
  //   await contracts.bitFighters.connect(addresses.addr2).mintMultiBitfighter(["abcd"], addresses.sys1Wallet.address, 0, "", false, true)
  //   console.log("try to mint a bf with user 2 done")

  //   tokensOwnedByUser1 = await contracts.presaleV2Drip.fetchPreSaleCardsOfUser(addresses.addr1.address);
  //   console.log(tokensOwnedByUser1)

  //   let bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
  //   console.log("bitfighters owned by user1 -*******-", bitfightersOfUser1)

  //   // 
  //   await contracts.presaleV2Drip.setBitfighterContractAddress(contracts.bitFighters.address);
  //   await contracts.bitFighters.connect(addresses.addr1).mintLaunchPartnerFighterUsingMintCard(["abcde"], [2], 0, "drip");

  //   bitfightersOfUser1 = await contracts.bitFighters.getTokensOfUser(addresses.addr1.address);
  //   console.log("bitfighters owned by user1 ---", bitfightersOfUser1)

  //   tokensOwnedByUser1 = await contracts.presaleV2Drip.fetchPreSaleCardsOfUser(addresses.addr1.address);
  //   console.log(tokensOwnedByUser1)
  // });
});