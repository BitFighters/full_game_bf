// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./BitFightersNFT.sol";

import "./PartnerFighter.sol";

contract GameLogic is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public totalPartners;
    Counters.Counter public totalPacks;
    address public bitfighterNFTContract;

    ERC20 public btcB;
    address public BtcbAddress;
    address public bitfightersNFTAddress;

    address public treasuryWalletAddress;
    address public systemWalletAddress1;
    address public systemWalletAddress2;

    address public atmWallet;
    address public vault;
    uint256 public atmFloatPercent = 40;
    bool public redeemLock = false;

    mapping(address => uint256) public _deposits;
    mapping(address => uint256) public _depositCount;
    mapping(address => uint256) public _redeemCount;

    mapping(address => uint256[]) public _depositNFT;

    uint256 public mintingTreasuryShare = 50;
    uint256 public mintingSystemShare = 50;
    uint256 public withdrawalFee = 4000;

    struct PartnersInfo {
        string partner_id;
        address partner_address;
        uint256 support_fees;
    }

    struct PacksInfo {
        uint256 quantity;
        uint256 price;
    }

    mapping(uint256 => PartnersInfo) public partnersMapping;
    mapping(uint256 => PacksInfo) public packsMapping;
    mapping(string => address) public PartnersNFTAddress;
    string[] public partnerKeys;

    constructor() ReentrancyGuard() {}

    function addPartnerNFTAddress(
        string memory partner_name,
        address partner_address
    ) public onlyOwner {
        if (PartnersNFTAddress[partner_name] == address(0)) {
            partnerKeys.push(partner_name);
        }
        PartnersNFTAddress[partner_name] = partner_address;
    }

    function getPartnerAddress(
        string memory key
    ) public view returns (address) {
        return PartnersNFTAddress[key];
    }

    function stakeNFT(uint256 nft_id) public {
        require(atmWallet != address(0), "Set ATM Wallet");
        require(
            bitfightersNFTAddress != address(0),
            "Set Bit Fighters Address"
        );
        address _sender = msg.sender;
        require(
            BitFightersNFT(bitfightersNFTAddress).checkIfUserOwns(
                _sender,
                nft_id
            ),
            "User does not own this NFT"
        );
        BitFightersNFT(bitfightersNFTAddress).transferFrom(
            _sender,
            atmWallet,
            nft_id
        );
        _depositNFT[_sender].push(nft_id);
    }

    function releaseNFT(address _player, uint256 nft_id) public onlyOwner {
        require(atmWallet != address(0), "Set ATM Address");
        require(
            bitfightersNFTAddress != address(0),
            "Set Bit Fighters Address"
        );
        bool check = false;
        uint256[] memory _temp = new uint256[](_depositNFT[_player].length - 1);
        uint256 j = 0;
        for (uint256 i = 0; i < _depositNFT[_player].length; i++) {
            if (_depositNFT[_player][i] == nft_id) {
                check = true;
            } else {
                _temp[j] = _depositNFT[_player][i];
                j++;
            }
        }
        require(check, "This does not exist in ATM.");
        BitFightersNFT(bitfightersNFTAddress).transferFrom(
            atmWallet,
            _player,
            nft_id
        );
        _depositNFT[_player] = _temp;
    }

    function setBitFightersContract(
        address _bitfightersNFTAddress
    ) external onlyOwner {
        bitfightersNFTAddress = _bitfightersNFTAddress;
    }

    function setBtcbContract(address _btcBContractAddress) external onlyOwner {
        BtcbAddress = _btcBContractAddress;
        btcB = ERC20(_btcBContractAddress);
    }

    function getWalletbalance(address account) public view returns (uint256) {
        return _deposits[account];
    }

    function depositFundsToVault(uint256 _amount) public payable nonReentrant {
        require(BtcbAddress != address(0), "Set BTC.b Address");
        require(atmWallet != address(0), "Set ATM Address");
        require(vault != address(0), "Set Vault Address");
        address _sender = msg.sender;
        require(
            checkBtcbBalanceOfAddress(_sender) >= _amount,
            "Deposit Amount is greater than Wallet Balance"
        );
        btcB.transferFrom(_sender, vault, _amount);
        uint256 value = _deposits[_sender];
        value = value.add(_amount);
        _deposits[_sender] = value;
        _depositCount[_sender] = _depositCount[_sender] + 1;
    }

    function setAllWallets(
        address _treasuryWalletAddress,
        address _systemWalletAddress1,
        address _systemWalletAddress2,
        address _atmWalletAddress,
        address _atmVaultAddress
    ) external onlyOwner {
        treasuryWalletAddress = _treasuryWalletAddress;
        systemWalletAddress1 = _systemWalletAddress1;
        systemWalletAddress2 = _systemWalletAddress2;
        atmWallet = _atmWalletAddress;
        vault = _atmVaultAddress;
    }

    function setAtmFloatPercent(uint256 _share) external onlyOwner {
        atmFloatPercent = _share;
    }

    function transferFundsToDepositWalletFromVault()
        external
        payable
        onlyOwner
    {
        uint256 balanceOfVault = checkBtcbBalanceOfAddress(vault);
        uint256 _amt = balanceOfVault.mul(atmFloatPercent).div(100);
        btcB.transferFrom(vault, atmWallet, _amt);
    }

    function TransferFundsToSystemWalletsFromVault(
        uint256 _amt,
        address _address
    ) external payable onlyOwner {
        btcB.transferFrom(vault, _address, _amt);
    }

    function updateFundsInAtm(
        address _player,
        uint256 _value
    ) public onlyOwner nonReentrant {
        _deposits[_player] = _value;
    }

    function redeemFundsFromAtm(
        address _player,
        uint256 _amount
    ) public onlyOwner nonReentrant {
        require(
            _deposits[_player] > 0,
            "Sorry. You have a 0 balance in the ATM."
        );
        require(
            !redeemLock,
            "Sorry. ATM redeeming is currently locked. Please check announcements for more info."
        );
        uint256 amount = _deposits[_player];
        require(_amount <= amount, "Insufficient balance. Please try again.");
        amount = amount.sub(_amount);
        _deposits[_player] = amount;
        _redeemCount[_player] = _redeemCount[_player] + 1;
        _amount = _amount.sub(
            withdrawalFee,
            "Minimum withdrawal amount must be greater than withdrawal fee."
        );
        btcB.transferFrom(atmWallet, owner(), withdrawalFee);
        btcB.transferFrom(atmWallet, _player, _amount);
    }

    function changeWithdrawalFee(uint256 _newTax) public onlyOwner {
        withdrawalFee = _newTax;
    }

    function addPartners(
        string memory partner_id,
        address partner_address,
        uint256 support_fees
    ) public onlyOwner {
        totalPartners.increment();
        uint256 currentPartnerId = totalPartners.current();
        partnersMapping[currentPartnerId] = PartnersInfo(
            partner_id,
            partner_address,
            support_fees
        );
    }

    function addPackInfo(uint256 _quantity, uint256 _price) public onlyOwner {
        totalPacks.increment();
        uint256 currentPackId = totalPacks.current();
        packsMapping[currentPackId] = PacksInfo(_quantity, _price);
    }

    function removePack(uint256 _quantity) public onlyOwner {
        uint256 deleteIndex;
        for (uint256 i = 1; i <= totalPacks.current(); i++) {
            PacksInfo memory _packInfo = packsMapping[i];
            if (_packInfo.quantity == _quantity) {
                deleteIndex = i;
                break;
            }
        }
        if (deleteIndex > 0) {
            PacksInfo memory _temp = packsMapping[totalPacks.current()];
            packsMapping[totalPacks.current()] = packsMapping[deleteIndex];
            packsMapping[deleteIndex] = _temp;
            delete packsMapping[totalPacks.current()];
            totalPacks.decrement();
        }
    }

    function removePartner(string memory partner_id) public onlyOwner {
        uint256 deleteIndex;
        for (uint256 i = 1; i <= totalPartners.current(); i++) {
            PartnersInfo memory _partnerInfo = partnersMapping[i];
            if (
                keccak256(abi.encodePacked(_partnerInfo.partner_id)) ==
                keccak256(abi.encodePacked(partner_id))
            ) {
                deleteIndex = i;
                break;
            }
        }
        if (deleteIndex > 0) {
            PartnersInfo memory _temp = partnersMapping[
                totalPartners.current()
            ];
            partnersMapping[totalPartners.current()] = partnersMapping[
                deleteIndex
            ];
            partnersMapping[deleteIndex] = _temp;
            delete partnersMapping[totalPartners.current()];
            totalPartners.decrement();
        }
    }

    function fetchPartner(
        uint256 index
    ) public view returns (PartnersInfo memory) {
        PartnersInfo memory _partnerInfo = partnersMapping[index];
        return _partnerInfo;
    }

    function fetchPackInfo(
        uint256 index
    ) public view returns (PacksInfo memory) {
        PacksInfo memory _packInfo = packsMapping[index];
        return _packInfo;
    }

    function fetchAllNamesOfPartners() public view returns (string[] memory) {
        string[] memory arr = new string[](totalPartners.current());
        for (uint256 i = 1; i <= totalPartners.current(); i++) {
            PartnersInfo memory _partnerInfo = partnersMapping[i];
            arr[i - 1] = _partnerInfo.partner_id;
        }
        return arr;
    }

    function fetchPartnersInfo(
        string memory _partner_id
    ) public view returns (PartnersInfo memory) {
        uint256 required_index = 1;
        for (uint256 i = 1; i <= totalPartners.current(); i++) {
            PartnersInfo memory _partnerInfo = partnersMapping[i];
            if (
                keccak256(abi.encodePacked(_partnerInfo.partner_id)) ==
                keccak256(abi.encodePacked(_partner_id))
            ) {
                required_index = i;
                break;
            }
        }
        PartnersInfo memory partnerInfo = partnersMapping[required_index];
        return partnerInfo;
    }

    function fetchAllAddressOfPartners()
        public
        view
        returns (address[] memory)
    {
        address[] memory arr = new address[](totalPartners.current());
        for (uint256 i = 1; i <= totalPartners.current(); i++) {
            PartnersInfo memory _partnerInfo = partnersMapping[i];
            arr[i - 1] = _partnerInfo.partner_address;
        }
        return arr;
    }

    function checkBtcbBalanceOfAddress(
        address _sender
    ) public view returns (uint256) {
        return btcB.balanceOf(_sender);
    }

    function mintMultiBitFighter(
        address _sender,
        string memory _partner,
        bool _support,
        uint256 quantity
    ) external {
        require(BtcbAddress != address(0), "Set BTCb Address");

        bool packFound = false;
        uint256 _price;
        for (uint256 i = 1; i <= totalPacks.current(); i++) {
            PacksInfo memory _packsInfo = packsMapping[i];
            if (_packsInfo.quantity == quantity) {
                packFound = true;
                _price = _packsInfo.price;
                break;
            }
        }
        require(packFound, "Invalid Quantity");
        require(
            checkBtcbBalanceOfAddress(_sender) >= _price,
            "Insufficient balance. Please try again."
        );

        uint256 _amountForTreasury = _price.mul(mintingTreasuryShare).div(100);
        address toSendPartnerWallet = treasuryWalletAddress;
        for (uint256 i = 1; i <= totalPartners.current(); i++) {
            PartnersInfo memory partnersInfo = partnersMapping[i];
            if (
                keccak256(abi.encodePacked(_partner)) ==
                keccak256(abi.encodePacked(partnersInfo.partner_id))
            ) {
                toSendPartnerWallet = partnersInfo.partner_address;
                if (_support) {
                    IERC20(BtcbAddress).transferFrom(
                        _sender,
                        toSendPartnerWallet,
                        partnersInfo.support_fees
                    );
                    break;
                }
            }
        }

        btcB.transferFrom(_sender, toSendPartnerWallet, _amountForTreasury);
        uint256 _amountForSystem = _price.mul(mintingSystemShare).div(200);
        btcB.transferFrom(_sender, systemWalletAddress1, _amountForSystem);
        btcB.transferFrom(_sender, systemWalletAddress2, _amountForSystem);
    }

    function mintMultiPartnerFighter(
        address _sender,
        string memory _partner,
        bool _support,
        uint256 quantity
    ) external {
        require(BtcbAddress != address(0), "Set BTCb Address");

        bool packFound = false;
        uint256 _price;
        for (uint256 i = 1; i <= totalPacks.current(); i++) {
            PacksInfo memory _packsInfo = packsMapping[i];
            if (_packsInfo.quantity == quantity) {
                packFound = true;
                _price = _packsInfo.price;
                break;
            }
        }
        require(packFound, "Invalid Quantity");
        require(
            checkBtcbBalanceOfAddress(_sender) >= _price,
            "Insufficient balance. Please try again."
        );

        uint256 _amountForTreasury = _price.mul(mintingTreasuryShare).div(100);
        address toSendPartnerWallet = treasuryWalletAddress;
        for (uint256 i = 1; i <= totalPartners.current(); i++) {
            PartnersInfo memory partnersInfo = partnersMapping[i];
            if (
                keccak256(abi.encodePacked(_partner)) ==
                keccak256(abi.encodePacked(partnersInfo.partner_id))
            ) {
                toSendPartnerWallet = partnersInfo.partner_address;
                if (_support) {
                    IERC20(BtcbAddress).transferFrom(
                        _sender,
                        toSendPartnerWallet,
                        partnersInfo.support_fees
                    );
                    break;
                }
            }
        }

        btcB.transferFrom(_sender, toSendPartnerWallet, _amountForTreasury);
        uint256 _amountForSystem = _price.mul(mintingSystemShare).div(200);
        btcB.transferFrom(_sender, systemWalletAddress1, _amountForSystem);
        btcB.transferFrom(_sender, systemWalletAddress2, _amountForSystem);
    }

    function setMintShares(
        uint256 _mintTreasuryShare,
        uint256 _mintingSystemShare
    ) external onlyOwner {
        mintingTreasuryShare = _mintTreasuryShare;
        mintingSystemShare = _mintingSystemShare;
    }

    function setRedeemLock(bool _lock) external onlyOwner {
        redeemLock = _lock;
    }
}
