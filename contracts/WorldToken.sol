// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title WorldToken
 * @dev ERC721 token for minting world IP on Story/Polygon
 */
contract WorldToken is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    struct WorldMetadata {
        string name;
        string geography;
        string culture;
        string era;
        string description;
        address creator;
        uint256 createdAt;
    }

    mapping(uint256 => WorldMetadata) public worlds;

    event WorldMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string name
    );

    constructor(string memory baseURI) ERC721("WorldToken", "WORLD") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function mint(
        address to,
        string memory name,
        string memory geography,
        string memory culture,
        string memory era,
        string memory description
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        worlds[tokenId] = WorldMetadata({
            name: name,
            geography: geography,
            culture: culture,
            era: era,
            description: description,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit WorldMinted(tokenId, msg.sender, name);
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

