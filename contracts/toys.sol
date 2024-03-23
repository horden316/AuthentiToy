// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Toys is ERC721, Ownable(msg.sender)  {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;

    struct ToyInfo {
        string ownerName;
        string toyName;
    }

    mapping(uint256 => ToyInfo) private _toyInfos;

    constructor() ERC721("Toys", "TOY") {}

    function mint(address to, string memory toyName) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);
        _toyInfos[tokenId] = ToyInfo("", toyName);
    }

    function setOwnerName(uint256 tokenId, string memory ownerName) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");
        _toyInfos[tokenId].ownerName = ownerName;
    }

    function setToyName(uint256 tokenId, string memory toyName) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");
        _toyInfos[tokenId].toyName = toyName;
    }

    function getToyInfo(uint256 tokenId) public view returns (string memory ownerName, string memory toyName) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return (_toyInfos[tokenId].ownerName, _toyInfos[tokenId].toyName);
    }
}
