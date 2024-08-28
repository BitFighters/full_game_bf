// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IPartnerMintCard {
    function fetchReferrer(uint256 _tokenID) external view returns (address);

    function fetchPreSaleCardsOfUser(
        address _userAddress
    ) external view returns (uint256[] memory value);

    function burnMintCard(uint256 _tokenID) external;
}

interface IGameLogic {
    function mintMultiBitFighter(
        address _sender,
        string memory _partner,
        bool _support,
        uint256 quantity
    ) external;

    function mintMultiPartnerFighter(
        address _sender,
        string memory _partner,
        bool _support,
        uint256 quantity
        // string memory partnerID
    ) external;
}
