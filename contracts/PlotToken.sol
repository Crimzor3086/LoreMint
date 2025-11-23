// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title PlotToken
 * @dev ERC721 token for minting plot arc IP on Story/Polygon
 */
contract PlotToken is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    struct PlotMetadata {
        string title;
        string description;
        uint256[] characterIds;
        uint256 worldId;
        address creator;
        uint256 createdAt;
    }

    mapping(uint256 => PlotMetadata) public plots;

    event PlotMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string title
    );

    constructor(string memory baseURI) ERC721("PlotToken", "PLOT") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function mint(
        address to,
        string memory title,
        string memory description,
        uint256[] memory characterIds,
        uint256 worldId
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        plots[tokenId] = PlotMetadata({
            title: title,
            description: description,
            characterIds: characterIds,
            worldId: worldId,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit PlotMinted(tokenId, msg.sender, title);
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

