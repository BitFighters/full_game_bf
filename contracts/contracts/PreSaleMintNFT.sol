// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract PreSaleMintNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    mapping(address => uint256[]) addressToTokenIdsMapping;

    // addresses
    address public wbtcAddress;
    address public systemWalletAddress;
    address public treasuryWalletAddress;

    // price
    uint256 public priceOfPreSaleNFT = 100000;
    // quantity
    uint256 public totalPresaleCoupons = 2000;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function setWbtcContract(address _wbtcContractAddress) external onlyOwner {
        wbtcAddress = _wbtcContractAddress;
    }

    function checkwbtcBalanceOfAddress(
        address _sender
    ) public view returns (uint256) {
        return ERC20(wbtcAddress).balanceOf(_sender);
    }

    function changePriceOfPreSaleNFT(uint256 _amount) public onlyOwner {
        priceOfPreSaleNFT = _amount;
    }

    function setTreasuryWalletAddress(address _wallet) public onlyOwner {
        treasuryWalletAddress = _wallet;
    }

    function setSystemWalletAddress(address _wallet) public onlyOwner {
        systemWalletAddress = _wallet;
    }

    function mintPreSaleBitfighterCard(
        string memory _tokenURI
    ) public returns (uint256) {
        // condition checks
        require(wbtcAddress != address(0), "Set wbtc contract");
        require(systemWalletAddress != address(0), "Set system wallet");
        require(treasuryWalletAddress != address(0), "Set treasury wallet");
        require(
            checkwbtcBalanceOfAddress(msg.sender) >= priceOfPreSaleNFT,
            "LESS BALANCE"
        );

        //
        uint256 totalNFtsSold = _tokenIds.current();
        console.logUint(totalNFtsSold);
        require(
            totalNFtsSold < totalPresaleCoupons,
            "PreSale Quantity threshold reached"
        );

        // payment
        uint256 _amountForTreasury = priceOfPreSaleNFT.mul(50).div(100);
        console.log("amount for treasury ");
        console.log(_amountForTreasury);
        ERC20(wbtcAddress).transferFrom(
            msg.sender,
            treasuryWalletAddress,
            _amountForTreasury
        );
        ERC20(wbtcAddress).transferFrom(
            msg.sender,
            systemWalletAddress,
            _amountForTreasury
        );

        // minting
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);
        addressToTokenIdsMapping[msg.sender].push(currentTokenId);
        return currentTokenId;
    }

    function changeTokenURI(
        string memory _tokenURI,
        uint256 _tokenID
    ) public onlyOwner {
        _setTokenURI(_tokenID, _tokenURI);
    }

    function fetchPreSaleCardsOfUser(
        address _userAddress
    ) public view returns (uint256[] memory value) {
        uint256[] memory values = addressToTokenIdsMapping[_userAddress];
        return values;
    }

    function getMintedCouponsCount() public view returns (uint256) {
        return _tokenIds.current();
    }
}
