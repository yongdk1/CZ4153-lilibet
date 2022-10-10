// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma experimental ABIEncoderV2;

// TO DO
// 1. add trusted arbitrator to createTopic
// 2. update timestamp check for schedule in createTopic

contract PredictionMarket{

    address payable contractCreator;
    address public oracle;

    constructor(address _oracle) payable {
        contractCreator = payable(msg.sender);
        oracle = _oracle;
    }

    // topic mappings: 
    // Keep track of all createdTopics to prevent duplicates
    mapping(string => bool) public createdTopics;

    // There are two different dates associated with each created topic:
    // 1. deadline when a user can no longer place new bets
    mapping(string => uint64) public topicDeadlines;
    // 2. deadline for oracle to submit the bet's final result
    mapping(string => uint64) public topicSchedules;

    // Keep track of all owners to handle commission fees
    mapping(string => address payable) public topicOwners; 

    // Custom minimum entry for each topic, set by their owner
    mapping(string => uint256) public topicMinimum;

    // Total pooled per topic
    mapping(string => uint256) public topicPools;
    // For each topic, how much is the total pooled per side; resultPools[topicID][side]
    mapping(string => mapping(string => uint256)) public resultPools;
    // For each topic, how much each has each user put into that topic's pool; userPools[topicID][msg.sender]
    mapping(string => mapping(address => uint256)) public userPools;

    // // commision related:
    // mapping(string => uint256) public topicCommissions;
    // // There's a 1 wei fixed commission transferred to the contract's creator for every placed bet
    // uint256 constant fixedCommission = 1;
    // // Minimum entry for all bets, topic owners cannot set it lower than this 
    uint256 constant minimumBet = 2;
    
    // query price for oracle to submit bet results
    uint256 public oraclePrice;

    /*
    // Queries can't be scheduled more than 60 days in the future
    uint64 constant scheduleThreshold = 60 * 24 * 60 * 60;
    */

    /* Require some initial funds to cover the cost of the oracle.
    If they are not enough to pay for it, the user should be informed and their funds returned. */
    event LackingFunds(address indexed sender, uint256 funds);

    /* Contains all the information that does not need to be saved as a state variable, 
    but which can prove useful to people taking a look at the bet in the frontend. */
    event CreatedBet(string indexed _id, string description, string query);

    function createTopic(string memory topicID, string memory topic, string[] memory sides, uint64 deadline, uint64 schedule, uint256 minimum, string memory description) public payable {

        require(
            bytes(topicID).length > 0
            && sides.length > 1
            && deadline > block.timestamp // topic can't be set in the past
            && deadline <= schedule // Users should only be able to place bets before it is actually executed
            // && schedule < block.timestamp + scheduleThreshold
            // && msg.value >= initialPool
            // && commission > 1 // Commission can't be higher than 50%
            && minimum >= minimumBet
            && !createdTopics[topicID], // Can't have duplicate topics
            "Unable to create topic, check arguments."
        );

        // // The remaining balance should be enough to cover the cost of the smart oracle query
        // uint256 balance = msg.value;

        // // oraclePrice = provable_getPrice("URL");
        // oraclePrice = 0;

        // if (oraclePrice > balance) {
        //     emit LackingFunds(msg.sender, oraclePrice);
        //     (bool success, ) = msg.sender.call.value(msg.value)("");
        //     require(success, "Error when returning funds to bet owner.");
        //     return;
        // }

        // Create topic
        createdTopics[topicID] = true;
        topicOwners[topicID] = payable(msg.sender);
        topicDeadlines[topicID] = deadline;
        topicSchedules[topicID] = schedule;
        topicMinimum[topicID] = minimum;
        // topicCommissions[topicID] = commission;

        // /* By adding the initial pool to the topic creator's, 
        // but not associating it with any results, we allow the creator to incentivize 
        // people to participate without needing to place a bet themselves. */
        // userPools[topicID][msg.sender] += initialPool;
        // topicPools[topicID] = initialPool;

        // initialize the sides, set pool for each side to 0
        for (uint i = 0; i < sides.length; i++) {
            resultPools[topicID][sides[i]] = 0;
        }

        emit CreatedBet(topicID, description, topic);
    }

    // The table in the frontend representing each topic's pool is populated according to these events.
    event PlacedBets(address indexed user, string indexed _id, string id, string side);

    // For each bet, track how much each user has put into each side
    mapping(string => mapping(address => mapping(string => uint256))) public userBets;
    
    // only allow user to bet on 1 topic and 1 side each time
    function placeBet(string memory topicID, string memory side) public payable {
        require(
            // results.length > 0 
            // && results.length == amounts.length 
            createdTopics[topicID]
            && !finishedTopics[topicID] 
            && topicDeadlines[topicID] >= block.timestamp,
        "Unable to place bets, check arguments.");

        uint256 bet = msg.value;

        require(
        bytes(side).length > 0 
        && msg.value >= topicMinimum[topicID],
        "Attempted to place invalid bet, check amounts and results");

        // bet -= fixedCommission;

        // Update all required state
        resultPools[topicID][side] += bet;
        userPools[topicID][msg.sender] += bet;
        topicPools[topicID] += bet;
        userBets[topicID][msg.sender][side] += bet;

        // // Fixed commission transfer
        // (bool success, ) = contractCreator.call.value(fixedCommission)("");
        // require(success, "Failed to transfer fixed commission to contract creator.");

        emit PlacedBets(msg.sender, topicID, topicID, side);
    }

    // Keep track of when a bet ends and what its result was
    mapping(string => bool) public finishedTopics;
    mapping(string => string) public topicResults;

    // Emit result
    event ReportedResult(string indexed _id, string result);

    // Function executed by oracle when the topic is scheduled to close
    function reportResult(string memory topicID, string memory result) public {
        require(msg.sender == oracle && !finishedTopics[topicID], 'only oracle can report the result');
        
        topicResults[topicID] = result;
        finishedTopics[topicID] = true;

        emit ReportedResult(topicID, result);
    }

    // For each bet, track which users have already claimed their potential reward
    mapping(string => mapping(address => bool)) public claimedBets;
    
    /* If the oracle service's scheduled callback was not executed after 5 days, 
    a user can reclaim his funds after the bet's execution threshold has passed. 
    Note that even if the callback execution is delayed,
    oracle should've extracted the result at the originally scheduled time. */
    uint64 constant topicThreshold = 5 * 24 * 60 * 60;
    
    // If the user wins the bet, let them know along with the reward amount.
    event WonBet(address indexed winner, uint256 won);
    
    // If the user lost no funds are claimable.
    event LostBet(address indexed loser);
    
    /* If no one wins the bet the funds can be refunded to the user, 
    after the bet creator's takes their cut. */
    event UnwonBet(address indexed refunded);
    
    function claimBet(string memory topicID) public {
        bool topicExpired = topicSchedules[topicID] + topicThreshold < block.timestamp;
        
        // If the bet has not finished but its threshold has been reached, let the user get back their funds
        require(
            (finishedTopics[topicID] || topicExpired) 
            && !claimedBets[topicID][msg.sender] 
            && userPools[topicID][msg.sender] != 0,
        "Invalid bet state while claiming reward.");
        
        claimedBets[topicID][msg.sender] = true;
        
        string memory result = topicResults[topicID];
        uint256 userBet = userBets[topicID][msg.sender][result];
        uint256 winnerPool = resultPools[topicID][result];
        uint256 reward;
        
        if (winnerPool == 0) {
            // If no one won then all bets are refunded
            reward = userPools[topicID][msg.sender];
            emit UnwonBet(msg.sender);
        } else if (userBet != 0) {
            // User gets their corresponding fraction of the loser's pool, along with their original bet
            uint256 loserPool = topicPools[topicID] - winnerPool;
            reward = userBet + loserPool * userBet / winnerPool;
            emit WonBet(msg.sender, reward);
        } else {
            // User lost
            emit LostBet(msg.sender);
            return;
        }
        
        // Bet owner gets their commission
        // uint256 ownerFee = reward - topicCommissions[topicID];
        // reward -= ownerFee;
        (bool success, ) = msg.sender.call{value:reward}("");
        require(success, "Failed to transfer reward to user.");
        // (success, ) = topicOwners[topicID].call.value(ownerFee)("");
        // require(success, "Failed to transfer commission to bet owner.");
        emit WonBet(msg.sender, reward);
    }
}
