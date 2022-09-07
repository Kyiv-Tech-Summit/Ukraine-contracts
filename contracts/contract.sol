// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract RidneMisto is ERC1155, Ownable, Pausable {
    string public name;
    string public symbol;
    uint256 mintPrice;

    uint256 maxTokenId;
    mapping(uint256 => string) tokenIdtoMetadata;

    mapping(address => bool) public isWhitelistedFund;
    mapping(uint256 => mapping(address => bool)) isWhitelistedLocalFund;

    uint256 public totalRaised;
    mapping(uint256 => uint256) public tokenToRaised;
    mapping(address => uint256) public raisedByAddress;
    mapping(address => uint256) public raisedForFund;

    event FundsAdded(address[] funds);
    event FundRemoved(address fund, string reason);

    //name and symbol unneeded?
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _mintPrice,
        string[] memory _tokenMetadata,
        address[] memory funds
    ) ERC1155("") {
        name = _name;
        symbol = _symbol;
        mintPrice = _mintPrice;
        addNewTokens(_tokenMetadata);
        addFundraisers(funds);
        _pause();
    }

    modifier isValidMint(uint256 token, address fund) {
        require(token <= maxTokenId && token != 0, "Wrong tokenId");
        require(
            isWhitelistedFund[fund] || isWhitelistedLocalFund[token][fund],
            "Fund not whitelisted"
        );
        _;
    }

    function _raiseAmountDonated(
        uint256 amount,
        address fund,
        uint256 token
    ) internal {
        totalRaised += amount;
        tokenToRaised[token] += amount;
        raisedForFund[fund] += amount;
        raisedByAddress[tx.origin] += amount;
    }

    function changeMintPrice(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "Can't set price to 0");
        mintPrice = newPrice;
    }

    function addFundraisers(address[] memory funds) public onlyOwner {
        for (uint256 i = 0; i < funds.length; ) {
            isWhitelistedFund[funds[i]] = true;
            unchecked {
                i++;
            }
        }
        emit FundsAdded(funds);
    }

    function addLocalFundraisers(address[] memory funds, uint256 cityId)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < funds.length; ) {
            isWhitelistedLocalFund[cityId][funds[i]] = true;
            unchecked {
                i++;
            }
        }
        emit FundsAdded(funds);
    }

    function removeFund(address fund, string memory reason) public onlyOwner {
        delete isWhitelistedFund[fund];
        emit FundRemoved(fund, reason);
    }

    function removeLocalFund(
        address fund,
        uint256 cityId,
        string memory reason
    ) public onlyOwner {
        delete isWhitelistedLocalFund[cityId][fund];
        delete isWhitelistedFund[fund];
        emit FundRemoved(fund, reason);
    }

    function addNewTokens(string[] memory _tokenMetadata) public onlyOwner {
        for (uint256 i = 0; i < _tokenMetadata.length; ) {
            tokenIdtoMetadata[maxTokenId + 1] = _tokenMetadata[i];
            unchecked {
                i++;
                maxTokenId++;
            }
        }
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    function mint(uint256 token, address fund)
        public
        payable
        isValidMint(token, fund)
        whenNotPaused
    {
        require(msg.value >= mintPrice, "Insufficent ETH provided");
        _mint(msg.sender, token, 1, "");

        (bool sent, ) = payable(fund).call{value: msg.value}("");
        require(sent, "Failed to send ETH to fund");
        _raiseAmountDonated(msg.value, fund, token);
    }

    function tokensOwned() public view returns (uint256[] memory) {
        uint256[] memory owned = new uint256[](maxTokenId);
        for (uint256 i = 0; i < maxTokenId; i++) {
            if (balanceOf(msg.sender, i) > 0) {
                owned[i] = 1;
            }
        }
        return owned;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenId <= maxTokenId && tokenId != 0, "Non-existant token");
        return tokenIdtoMetadata[tokenId];
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(tokenId <= maxTokenId && tokenId != 0, "Non-existant token");
        return tokenIdtoMetadata[tokenId];
    }
}
