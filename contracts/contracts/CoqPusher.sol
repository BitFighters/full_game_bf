// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CoqPusher is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    address public COQTokenAddress;
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
    uint256 public withdrawalFee = 4000; // @TODO: change it .. coz decimals are now 18

    constructor() ReentrancyGuard() {}

    function setCOQContract(address _COQTokenAddress) external onlyOwner {
        COQTokenAddress = _COQTokenAddress;
    }

    function getWalletbalance(address account) public view returns (uint256) {
        return _deposits[account];
    }

    function depositFundsToVault(uint256 _amount) public payable nonReentrant {
        require(COQTokenAddress != address(0), "Set BTC.b Address");
        require(atmWallet != address(0), "Set ATM Address");
        require(vault != address(0), "Set Vault Address");
        address _sender = msg.sender;
        require(
            checkCOQBalanceOfAddress(_sender) >= _amount,
            "Deposit Amount is greater than Wallet Balance"
        );
        ERC20(COQTokenAddress).transferFrom(_sender, atmWallet, _amount); // @TODO: check this
        uint256 value = _deposits[_sender];
        value = value.add(_amount);
        _deposits[_sender] = value;
        _depositCount[_sender] = _depositCount[_sender] + 1;
    }

    function setAllWallets(
        // address _treasuryWalletAddress,
        address _systemWalletAddress1,
        address _systemWalletAddress2,
        address _atmWalletAddress,
        address _atmVaultAddress
    ) external onlyOwner {
        // treasuryWalletAddress = _treasuryWalletAddress;
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
        uint256 balanceOfVault = checkCOQBalanceOfAddress(vault);
        uint256 _amt = balanceOfVault.mul(atmFloatPercent).div(100);
        ERC20(COQTokenAddress).transferFrom(vault, atmWallet, _amt);
    }

    function TransferFundsToSystemWalletsFromVault(
        uint256 _amt,
        address _address
    ) external payable onlyOwner {
        ERC20(COQTokenAddress).transferFrom(vault, _address, _amt);
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
        ERC20(COQTokenAddress).transferFrom(atmWallet, owner(), withdrawalFee);
        ERC20(COQTokenAddress).transferFrom(atmWallet, _player, _amount);
    }

    function changeWithdrawalFee(uint256 _newTax) public onlyOwner {
        withdrawalFee = _newTax;
    }

    function checkCOQBalanceOfAddress(
        address _sender
    ) public view returns (uint256) {
        return ERC20(COQTokenAddress).balanceOf(_sender);
    }

    function setRedeemLock(bool _lock) external onlyOwner {
        redeemLock = _lock;
    }
}
