// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// import "hardhat/console.sol";

contract OneKClubNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    mapping(address => uint256[]) addressToTokenIdsMapping;
    mapping(uint256 => address) public originalMinters;

    address public usdcAddress;
    address public systemWalletAddress1;
    address public systemWalletAddress2;
    address public treasuryWalletAddress;
    uint256 public priceOf1kClubNFT = 200000000; // decimals in usdc is 6
    uint256 public totalOneKClubNFTCards = 1000; // remeber to increase this after testing

    constructor(
        string memory _name,
        string memory _symbol,
        address _systemWalletAddress1,
        address _systemWalletAddress2,
        address _treasuryWalletAddress,
        address _usdcAddress
    ) ERC721(_name, _symbol) {
        systemWalletAddress1 = _systemWalletAddress1;
        systemWalletAddress2 = _systemWalletAddress2;
        treasuryWalletAddress = _treasuryWalletAddress;
        usdcAddress = _usdcAddress;
    }

    function setUSDCContractERC20(address _usdcAddress) external onlyOwner {
        usdcAddress = _usdcAddress;
    }

    function checkUSDCBalance(address _sender) public view returns (uint256) {
        return IERC20(usdcAddress).balanceOf(_sender);
    }

    function changepriceOf1kClubNFT(uint256 _amount) public onlyOwner {
        priceOf1kClubNFT = _amount;
    }

    function setTreasuryWalletAddress(address _wallet) public onlyOwner {
        treasuryWalletAddress = _wallet;
    }

    function setSystemWalletAddress1(address _wallet) public onlyOwner {
        systemWalletAddress1 = _wallet;
    }

    function setSystemWalletAddress2(address _wallet) public onlyOwner {
        systemWalletAddress2 = _wallet;
    }

    function mintOneKClubNFTCard() public returns (uint256) {
        // condition checks
        require(usdcAddress != address(0), "Set wbtc contract");
        require(systemWalletAddress1 != address(0), "Set system wallet");
        require(systemWalletAddress2 != address(0), "Set system wallet");
        require(treasuryWalletAddress != address(0), "Set treasury wallet");
        require(
            checkUSDCBalance(msg.sender) >= priceOf1kClubNFT,
            "LESS BALANCE"
        );

        //
        uint256 totalNFTsSold = _tokenIds.current();
        require(
            totalNFTsSold < totalOneKClubNFTCards,
            "OneK Club threshold reached"
        );

        // payment
        uint256 _amountForTreasury = priceOf1kClubNFT.mul(50).div(100);
        uint256 _amountForSystem = priceOf1kClubNFT.mul(25).div(100);
        IERC20(usdcAddress).transferFrom(
            msg.sender,
            treasuryWalletAddress,
            _amountForTreasury
        );
        IERC20(usdcAddress).transferFrom(
            msg.sender,
            systemWalletAddress1,
            _amountForSystem
        );
        IERC20(usdcAddress).transferFrom(
            msg.sender,
            systemWalletAddress2,
            _amountForSystem
        );

        // minting
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, "");
        addressToTokenIdsMapping[msg.sender].push(currentTokenId);
        originalMinters[currentTokenId] = msg.sender;

        priceOf1kClubNFT =
            priceOf1kClubNFT +
            priceOf1kClubNFT.mul(555).div(100000);
        return currentTokenId;
    }

    function mintMultiOnekClubNFTFighters(uint256 quanity) public {
        // condition checks
        require(usdcAddress != address(0), "Set wbtc contract");
        require(systemWalletAddress1 != address(0), "Set system wallet1");
        require(systemWalletAddress2 != address(0), "Set system wallet2");
        require(treasuryWalletAddress != address(0), "Set treasury wallet");
        require(
            checkUSDCBalance(msg.sender) >= quanity * priceOf1kClubNFT,
            "LESS BALANCE"
        );
        require(quanity > 0, "Quanity is less than 1");

        uint256 totalNFTsSold = _tokenIds.current();
        require(
            totalNFTsSold + quanity <= totalOneKClubNFTCards,
            "Cannot purchase the specified amount"
        );

        for (uint8 i = 0; i < quanity; i++) {
            mintOneKClubNFTCard();
        }
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
        uint256[] memory userTokens = fetchOneKCardsForUser(_owner);
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
    ) public onlyOwner {
        _setTokenURI(_tokenID, _tokenURI);
    }

    function fetchOneKCardsForUser(
        address _userAddress
    ) public view returns (uint256[] memory value) {
        uint256[] memory values = addressToTokenIdsMapping[_userAddress];
        return values;
    }

    function getMintedCardsCount() public view returns (uint256) {
        return _tokenIds.current();
    }
}
