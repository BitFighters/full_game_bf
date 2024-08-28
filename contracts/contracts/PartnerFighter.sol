// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Interface.sol";

contract PartnerFighterNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    struct ExtraInfoForNFTs {
        uint8 LuckyNumber;
        address Referer;
        string NickName;
        string Partner;
        bool support;
        address originalMinter;
    }

    mapping(address => uint256[]) addressToTokenIdsMappingBitfighters;
    mapping(uint256 => ExtraInfoForNFTs) public nftIdToExtraInfoMapping;
    mapping(uint8 => uint256) public limitCountOfGenNBitfighters;
    event PrintNumber(uint256 value);
    address public gameLogicContractAddress;
    address public mintCardContractAddress;
    bool public readyToMint = false;

    mapping(uint256 => address) public otherGenBFContractAddresses;
    uint256 public totalOtherGenBfContacts = 0;

    modifier accessChecker() {
        bool check = false;
        for (uint256 i = 1; i < totalOtherGenBfContacts; i++) {
            if (otherGenBFContractAddresses[i] == msg.sender) {
                check = true;
                break;
            }
        }

        if (owner() == msg.sender) {
            check = true;
        }

        if (gameLogicContractAddress == msg.sender) {
            check = true;
        }

        require(check, "UNAUTHORIZED");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function setGameLogicContract(
        address _gameLogicContractAddress
    ) external onlyOwner {
        gameLogicContractAddress = _gameLogicContractAddress;
    }

    function SetOtherGenContractAddreses(
        address _genNBFContraactAddress,
        uint256 _genId
    ) external onlyOwner {
        otherGenBFContractAddresses[_genId] = _genNBFContraactAddress;
        totalOtherGenBfContacts += 1;
    }

    function setMintCardContract(
        address _mintCardContractAddress
    ) external onlyOwner {
        mintCardContractAddress = _mintCardContractAddress;
    }

    // function setPriceOfGenN(uint256 _price, uint8 _gen) external onlyOwner {
    //     priceOfGenNBitFighters[_gen] = _price;
    // }

    function setNumberOfNFTsLimitForGenN(
        uint256 _countLimit,
        uint8 _gen
    ) external onlyOwner {
        limitCountOfGenNBitfighters[_gen] = _countLimit;
    }

    function changeMinitngState(bool _state) external onlyOwner {
        readyToMint = _state;
    }

    function getAllInfoOfBitfighter(
        uint256 _mintedId
    ) public view returns (ExtraInfoForNFTs memory result) {
        return nftIdToExtraInfoMapping[_mintedId];
    }

    function GetOtherGenContractAddreses(
        uint256 _genId
    ) external view onlyOwner returns (address) {
        return otherGenBFContractAddresses[_genId];
    }

    function getNFTsLimitCountForGenN(
        uint8 _gen
    ) public view returns (uint256) {
        return limitCountOfGenNBitfighters[_gen];
    }

    function mintSingleFighter(
        string memory _tokenURI,
        address referrer_address,
        string memory _partner,
        bool _support,
        address _sender
    ) internal {
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(_sender, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);
        addressToTokenIdsMappingBitfighters[_sender].push(currentTokenId);
        nftIdToExtraInfoMapping[currentTokenId] = ExtraInfoForNFTs(
            0,
            referrer_address,
            "",
            _partner,
            _support,
            _sender
        );
    }

    function mintMultiPartnerFighter(
        string[] memory _tokenURIs,
        address referrer_address,
        uint8 _gen,
        string memory _partner,
        bool _support
    ) public {
        address _sender = msg.sender;
        require(
            gameLogicContractAddress != address(0),
            "Set Game Contract Address"
        );
        require(readyToMint, "Minting is disabled. Please try again later.");
        require(
            referrer_address != _sender,
            "Nice try! Don't use your own address, silly!"
        );
        uint256 totalNFtsSold = _tokenIds.current();
        require(
            limitCountOfGenNBitfighters[_gen] != 0,
            "Limit of this this generation has not been set."
        );
        require(
            totalNFtsSold + _tokenURIs.length <=
                limitCountOfGenNBitfighters[_gen],
            "Sorry, this quantity is no longer available."
        );
        IGameLogic(gameLogicContractAddress).mintMultiPartnerFighter(
            _sender,
            _partner,
            _support,
            _tokenURIs.length
        );
        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            mintSingleFighter(
                _tokenURIs[i],
                referrer_address,
                _partner,
                _support,
                _sender
            );
        }
    }

    function nickNameValidate(
        string memory _name
    ) internal pure returns (bool) {
        return bytes(_name).length > 0 && bytes(_name).length < 13;
    }

    function registerBitfighter(
        string memory _name,
        uint8 lucky_number,
        uint256 _tokenID
    ) public {
        address _sender = msg.sender;
        require(checkIfUserOwns(_sender, _tokenID));
        require(lucky_number <= 100, "Lucky number should be less than 100.");
        require(lucky_number > 0, "Lucky number should be greater than 0.");
        require(
            nickNameValidate(_name),
            "Nickname length should be between 1 and 12 characters."
        );
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_tokenID];
        require(
            keccak256(abi.encodePacked(_extraInfo.NickName)) ==
                keccak256(abi.encodePacked("")),
            "Sorry, this fighter has already been registered!"
        );
        require(
            _extraInfo.LuckyNumber == 0,
            "Sorry, this fighter has already been registered!"
        );
        _extraInfo.NickName = _name;
        _extraInfo.LuckyNumber = lucky_number;
        nftIdToExtraInfoMapping[_tokenID] = _extraInfo;
    }

    function mintBitFighterWithMitCard(
        string[] memory _tokenURIs,
        uint8 _gen
    ) public {
        address _sender = msg.sender;
        require(
            gameLogicContractAddress != address(0),
            "Set Game Logic Contract Address."
        );
        require(readyToMint, "Minting is disabled. Please try again later.");
        uint256 totalNFtsSold = _tokenIds.current();
        require(
            limitCountOfGenNBitfighters[_gen] != 0,
            "Limit of this this generation has not been set."
        );
        require(
            totalNFtsSold + _tokenURIs.length <=
                limitCountOfGenNBitfighters[_gen],
            "Sorry, this quantity is no longer available."
        );

        require(
            mintCardContractAddress != address(0),
            "Set Presale Contract Address."
        );
        uint256[] memory mintCardsArr = IPartnerMintCard(
            mintCardContractAddress
        ).fetchPreSaleCardsOfUser(msg.sender);
        require(mintCardsArr.length > 0, "You do not own a Mint Card.");
        require(
            mintCardsArr.length >= _tokenURIs.length,
            "You do not own enough Mint Cards. Please try again."
        );
        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            address referrer = IPartnerMintCard(mintCardContractAddress)
                .fetchReferrer(mintCardsArr[mintCardsArr.length - i - 1]);

            IPartnerMintCard(mintCardContractAddress).burnMintCard(
                mintCardsArr[mintCardsArr.length - i - 1]
            );

            _tokenIds.increment();
            uint256 currentTokenId = _tokenIds.current();
            _safeMint(msg.sender, currentTokenId);
            _setTokenURI(currentTokenId, _tokenURIs[i]);
            addressToTokenIdsMappingBitfighters[msg.sender].push(
                currentTokenId
            );
            nftIdToExtraInfoMapping[currentTokenId] = ExtraInfoForNFTs(
                0,
                referrer,
                "",
                "",
                false,
                _sender
            );
        }
    }

    function getTokensOfUser(
        address _userAddress
    ) public view returns (uint256[] memory value) {
        uint256[] memory values = addressToTokenIdsMappingBitfighters[
            _userAddress
        ];
        return values;
    }

    function getRefererAddressForBitfighter(
        uint256 _mintedId
    ) public view returns (address referer) {
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_mintedId];
        return _extraInfo.Referer;
    }

    function getPartnerForBitfighter(
        uint256 _mintedId
    ) public view returns (string memory value) {
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_mintedId];
        return _extraInfo.Partner;
    }

    function getLuckyNumberForBitfighter(
        uint256 _mintedId
    ) public view returns (uint8 lucky_number) {
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_mintedId];
        return _extraInfo.LuckyNumber;
    }

    function getNickNameForBitfighter(
        uint256 _mintedId
    ) public view returns (string memory nick_name) {
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_mintedId];
        return _extraInfo.NickName;
    }

    function checkIfUserOwns(
        address _sender,
        uint256 _mintedId
    ) public view returns (bool) {
        uint256[] memory values = getTokensOfUser(_sender);
        bool check = false;
        for (uint256 i = 0; i < values.length; i++) {
            if (values[i] == _mintedId) {
                check = true;
                break;
            }
        }
        return check;
    }

    function setRefererForBitfighter(
        uint256 _mintedId,
        address _newRefererAddress
    ) public {
        address _sender = msg.sender;
        require(checkIfUserOwns(_sender, _mintedId));
        require(
            _newRefererAddress != _sender,
            "Nice try! Don't use your own address, silly!"
        );
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_mintedId];
        _extraInfo.Referer = _newRefererAddress;
        nftIdToExtraInfoMapping[_mintedId] = _extraInfo;
    }

    function setNickNameForBitfighter(
        uint256 _mintedId,
        string memory _newNickName
    ) public {
        address _sender = msg.sender;
        require(
            nickNameValidate(_newNickName),
            "Nickname length should be between 1 and 12 characters."
        );
        require(checkIfUserOwns(_sender, _mintedId));
        ExtraInfoForNFTs memory _extraInfo = nftIdToExtraInfoMapping[_mintedId];
        _extraInfo.NickName = _newNickName;
        nftIdToExtraInfoMapping[_mintedId] = _extraInfo;
    }

    function changeTokenURI(
        string memory _tokenURI,
        uint256 _tokenID
    ) public accessChecker {
        _setTokenURI(_tokenID, _tokenURI);
    }

    function burn(uint256 _tokenID) public accessChecker {
        bool exist = _exists(_tokenID);
        require(exist, "Token Does not exist");
        address _owner = ownerOf(_tokenID);
        uint256[] memory userTokens = getTokensOfUser(_owner);
        uint256[] memory userTokensAfterBurning = new uint256[](
            userTokens.length - 1
        );
        uint256 j = 0;
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == _tokenID) {
                continue;
            }
            userTokensAfterBurning[j] = userTokens[i];
            j = j + 1;
        }
        addressToTokenIdsMappingBitfighters[_owner] = userTokensAfterBurning;
        delete nftIdToExtraInfoMapping[_tokenID];
        super._burn(_tokenID);
    }

    function _transfer(
        address from,
        address send_to,
        uint256 _tokenID
    ) internal override {
        bool exist = _exists(_tokenID);
        require(exist, "Token Does not exist");
        address _owner = ownerOf(_tokenID);
        uint256[] memory userTokens = getTokensOfUser(_owner);
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
        addressToTokenIdsMappingBitfighters[_owner] = usersTokensAfterTransfer;
        addressToTokenIdsMappingBitfighters[send_to].push(_tokenID);
        super._transfer(from, send_to, _tokenID);
    }

    function getMintedBFsCount() public view returns (uint256) {
        return _tokenIds.current();
    }
}
