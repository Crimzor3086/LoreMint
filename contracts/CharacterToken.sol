// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CharacterToken
 * @dev ERC721 token for minting character IP on Story/Polygon
 */
contract CharacterToken is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    struct CharacterMetadata {
        string name;
        string backstory;
        string[] abilities;
        string[] traits;
        address creator;
        uint256 createdAt;
    }

    mapping(uint256 => CharacterMetadata) public characters;

    event CharacterMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string name
    );

    constructor(string memory baseURI) ERC721("CharacterToken", "CHAR") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function mint(
        address to,
        string memory name,
        string memory backstory,
        string[] memory abilities,
        string[] memory traits
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        characters[tokenId] = CharacterMetadata({
            name: name,
            backstory: backstory,
            abilities: abilities,
            traits: traits,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit CharacterMinted(tokenId, msg.sender, name);
        return tokenId;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }
}

