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

contract PreSaleMintNFTV2 is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    mapping(address => uint256[]) public addressToTokenIdsMapping;
    mapping(uint256 => address) public mintedIdToReferrerAddressMapping;
    mapping(uint256 => address) public originalMinters;

    // addresses
    address public wbtcAddress;
    address public systemWalletAddress1;
    address public systemWalletAddress2;
    address public treasuryWalletAddress;

    uint256 public priceOfPreSaleNFT = 20000;
    uint256 public totalPresaleCoupons = 2000;

    address public BFContractAddress =
        0x0000000000000000000000000000000000000000;

    constructor(
        string memory _name,
        string memory _symbol,
        address _treasuryWalletAddress,
        address _systemWalletAddress1,
        address _systemWalletAddress2
    ) ERC721(_name, _symbol) {
        setTreasuryWalletAddress(_treasuryWalletAddress);
        setSystemWalletAddress1(_systemWalletAddress1);
        setSystemWalletAddress2(_systemWalletAddress2);
    }

    modifier accessChecker() {
        require(
            msg.sender == owner() || msg.sender == BFContractAddress,
            "UNAUTHORIZED"
        );
        _;
    }

    function setWbtcContract(
        address _wbtcContractAddress
    ) external accessChecker {
        wbtcAddress = _wbtcContractAddress;
    }

    function setBitfighterContractAddress(
        address bitfightersContractAddress
    ) external accessChecker {
        BFContractAddress = bitfightersContractAddress;
    }

    function checkwbtcBalanceOfAddress(
        address _sender
    ) public view returns (uint256) {
        return ERC20(wbtcAddress).balanceOf(_sender);
    }

    function changePriceOfPreSaleNFT(uint256 _amount) public accessChecker {
        priceOfPreSaleNFT = _amount;
    }

    function changeTotalPreSaleCoupons(
        uint256 totalQuantity
    ) public accessChecker {
        totalPresaleCoupons = totalQuantity;
    }

    function setTreasuryWalletAddress(address _wallet) public accessChecker {
        treasuryWalletAddress = _wallet;
    }

    function setSystemWalletAddress1(address _wallet) public accessChecker {
        systemWalletAddress1 = _wallet;
    }

    function setSystemWalletAddress2(address _wallet) public accessChecker {
        systemWalletAddress2 = _wallet;
    }

    function mintPreSaleBitfighterCard(
        string memory _tokenURI,
        address _referrerAddress,
        address sender
    ) internal {
        // condition checks
        require(wbtcAddress != address(0), "Set wbtc contract");
        require(systemWalletAddress1 != address(0), "Set system wallet");
        require(systemWalletAddress2 != address(0), "Set system wallet");
        require(treasuryWalletAddress != address(0), "Set treasury wallet");
        require(
            checkwbtcBalanceOfAddress(sender) >= priceOfPreSaleNFT,
            "LESS BALANCE"
        );

        //
        uint256 totalNFtsSold = _tokenIds.current();
        console.logUint(totalNFtsSold);
        // console.log(msg.sender);
        require(
            totalNFtsSold < totalPresaleCoupons,
            "PreSale Quantity threshold reached"
        );

        // payment
        uint256 _amountForTreasury = priceOfPreSaleNFT.mul(50).div(100);
        uint256 _amountForSystemWallets = priceOfPreSaleNFT.mul(25).div(100);
        IERC20(wbtcAddress).transferFrom(
            msg.sender,
            treasuryWalletAddress,
            _amountForTreasury
        );
        IERC20(wbtcAddress).transferFrom(
            msg.sender,
            systemWalletAddress1,
            _amountForSystemWallets
        );
        IERC20(wbtcAddress).transferFrom(
            msg.sender,
            systemWalletAddress2,
            _amountForSystemWallets
        );

        // minting
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);
        addressToTokenIdsMapping[msg.sender].push(currentTokenId);
        mintedIdToReferrerAddressMapping[currentTokenId] = _referrerAddress;
        originalMinters[currentTokenId] = msg.sender;
        // return currentTokenId;
    }

    function mintMultiPresaleBitfighterCard(
        string[] memory _tokenURIs,
        address _referrerAddress
    ) public {
        // condition checks
        require(wbtcAddress != address(0), "Set wbtc contract");
        require(systemWalletAddress1 != address(0), "Set system wallet");
        require(systemWalletAddress2 != address(0), "Set system wallet");
        require(treasuryWalletAddress != address(0), "Set treasury wallet");
        require(
            checkwbtcBalanceOfAddress(msg.sender) >=
                priceOfPreSaleNFT * _tokenURIs.length,
            "LESS BALANCE"
        );
        address sender = msg.sender;

        //
        uint256 totalNFtsSold = _tokenIds.current();
        console.logUint(totalNFtsSold);
        require(
            totalNFtsSold < totalPresaleCoupons,
            "PreSale Quantity threshold reached"
        );

        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            mintPreSaleBitfighterCard(_tokenURIs[i], _referrerAddress, sender);
        }
    }

    function mintPreSaleBitfighterCardAdmin(
        string[] memory _tokenURIs,
        address airdrop_to
    ) public accessChecker {
        // condition checks
        require(wbtcAddress != address(0), "Set wbtc contract");
        require(systemWalletAddress1 != address(0), "Set system wallet");
        require(systemWalletAddress2 != address(0), "Set system wallet");
        require(treasuryWalletAddress != address(0), "Set treasury wallet");

        // minting
        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            _tokenIds.increment();
            uint256 currentTokenId = _tokenIds.current();
            _safeMint(airdrop_to, currentTokenId);
            _setTokenURI(currentTokenId, _tokenURIs[i]);
            addressToTokenIdsMapping[airdrop_to].push(currentTokenId);
            mintedIdToReferrerAddressMapping[currentTokenId] = address(0);
            originalMinters[currentTokenId] = airdrop_to;
        }
    }

    function burnMintCard(uint256 _tokenID) public accessChecker {
        console.log("---------****222");
        bool exist = _exists(_tokenID);
        require(exist, "Token Does not exist");
        address _owner = ownerOf(_tokenID);
        uint256[] memory userTokens = fetchPreSaleCardsOfUser(_owner);
        uint256[] memory usersTokensAfterTransfer = new uint256[](
            userTokens.length - 1
        );
        uint256 j = 0;
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == _tokenID) {
                continue;
            }
            usersTokensAfterTransfer[j] = userTokens[i];
            j = j + 1;
        }
        addressToTokenIdsMapping[_owner] = usersTokensAfterTransfer;

        super._burn(_tokenID);
    }

    event PrintDataInt(uint256 _data);
    event PrintDataString(string _data);

    function _transfer(
        address from,
        address send_to,
        uint256 _tokenID
    ) internal override {
        bool exist = _exists(_tokenID);
        require(exist, "Token Does not exist");
        emit PrintDataString("in-_transfer");
        address _owner = ownerOf(_tokenID);
        uint256[] memory userTokens = fetchPreSaleCardsOfUser(_owner);
        uint256[] memory usersTokensAfterTransfer = new uint256[](
            userTokens.length - 1
        );
        uint256 j = 0;
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == _tokenID) {
                continue;
            }
            usersTokensAfterTransfer[j] = userTokens[i];
            j = j + 1;
        }
        addressToTokenIdsMapping[_owner] = usersTokensAfterTransfer;
        addressToTokenIdsMapping[send_to].push(_tokenID);

        super._transfer(from, send_to, _tokenID);
    }

    function changeTokenURI(
        string memory _tokenURI,
        uint256 _tokenID
    ) public accessChecker {
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

    function fetchReferrer(uint256 _tokenID) public view returns (address) {
        return mintedIdToReferrerAddressMapping[_tokenID];
    }
}
