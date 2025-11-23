// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContributionManager
 * @dev Manages fan contributions and royalty distribution
 */
contract ContributionManager is Ownable {
    enum ContributionType {
        Character,
        Story,
        Artwork,
        Expansion
    }

    enum ContributionStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Contribution {
        uint256 id;
        ContributionType contributionType;
        string title;
        string description;
        address contributor;
        uint256 assetId; // ID of the character/world/plot being contributed to
        ContributionStatus status;
        uint256 votes;
        uint256 royaltyPercentage;
        uint256 createdAt;
    }

    mapping(uint256 => Contribution) public contributions;
    mapping(address => uint256[]) public contributorContributions;
    mapping(uint256 => uint256[]) public assetContributions;

    uint256 private _contributionCounter;
    uint256 public defaultRoyaltyPercentage = 10; // 10%

    event ContributionSubmitted(
        uint256 indexed contributionId,
        address indexed contributor,
        uint256 indexed assetId
    );

    event ContributionApproved(
        uint256 indexed contributionId,
        uint256 royaltyPercentage
    );

    event ContributionRejected(uint256 indexed contributionId);

    constructor() Ownable(msg.sender) {}

    function submitContribution(
        ContributionType contributionType,
        string memory title,
        string memory description,
        uint256 assetId
    ) public returns (uint256) {
        uint256 contributionId = _contributionCounter;
        _contributionCounter++;

        contributions[contributionId] = Contribution({
            id: contributionId,
            contributionType: contributionType,
            title: title,
            description: description,
            contributor: msg.sender,
            assetId: assetId,
            status: ContributionStatus.Pending,
            votes: 0,
            royaltyPercentage: defaultRoyaltyPercentage,
            createdAt: block.timestamp
        });

        contributorContributions[msg.sender].push(contributionId);
        assetContributions[assetId].push(contributionId);

        emit ContributionSubmitted(contributionId, msg.sender, assetId);
        return contributionId;
    }

    function approveContribution(
        uint256 contributionId,
        uint256 royaltyPercentage
    ) public onlyOwner {
        Contribution storage contribution = contributions[contributionId];
        require(
            contribution.status == ContributionStatus.Pending,
            "Contribution not pending"
        );

        contribution.status = ContributionStatus.Approved;
        contribution.royaltyPercentage = royaltyPercentage;

        emit ContributionApproved(contributionId, royaltyPercentage);
    }

    function rejectContribution(uint256 contributionId) public onlyOwner {
        Contribution storage contribution = contributions[contributionId];
        require(
            contribution.status == ContributionStatus.Pending,
            "Contribution not pending"
        );

        contribution.status = ContributionStatus.Rejected;
        emit ContributionRejected(contributionId);
    }

    function voteContribution(uint256 contributionId) public {
        contributions[contributionId].votes++;
    }

    function setDefaultRoyaltyPercentage(uint256 percentage) public onlyOwner {
        require(percentage <= 100, "Percentage must be <= 100");
        defaultRoyaltyPercentage = percentage;
    }
}

