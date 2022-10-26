// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma experimental ABIEncoderV2;

contract PredictionMarket{

    // CONTRACT DATA
    address payable contractCreator;
    address public oracle;

    constructor(address _oracle) payable {
        contractCreator = payable(msg.sender);
        oracle = _oracle;
    }

    function getOracle() public view returns (address){
        return oracle;
    }

    // Prediction Market Contract Creator reward: fixed commission transferred to the contract's creator for every placed bet
    uint256 constant fixedCommission = 100;
    // Minimum entry for all bets, topic owners cannot set it lower than this 
    uint256 constant minimumBet = fixedCommission + 1;
    // query price for oracle to submit bet results
    uint256 public oraclePrice;

    // TOPIC DATA
    // Information about a topic in a struct
    struct topics {
        string id;
        string name;
        string[] outcomes;
        uint64 endDate;
        uint256 minBet;
        uint256 comm;
        string desc;
        address judge;
        address owner;
        bool finished;
        string result;
        uint256 userBet;
        bool claimed;
    }

    // Array of all topics
    // topics[] public topicList;
    mapping(string => topics) topicList;
    // []string[] public topicSides
    mapping(string => string[]) topicSides;

    // Keep track of all topic IDs
    string[] public allTopics;
    // Keep track of all createdTopics to prevent duplicates
    mapping(string => bool) public createdTopics;
    // Keep track of arbitrator address
    mapping(string => address) public topicArbitrator;

    // There are two different dates associated with each created topic:
    // 1. deadline when a user can no longer place new bets
    mapping(string => uint64) public topicDeadlines;
    // 2. deadline for oracle to submit the topic's final result - fixed at 30 days after topicDeadline
    uint64 constant scheduleThreshold = 30 * 24 * 60 * 60; 
    mapping(string => uint64) public topicSchedules;
    /* 3. If the oracle service's scheduled callback was not executed after 5 days, a user can reclaim his funds after the topic's execution threshold has passed. */
    uint64 constant topicThreshold = 5 * 24 * 60 * 60;

    // COMMISSION related:
    // Keep track of all owners to handle commission fees
    mapping(string => address payable) public topicOwners; 
    // Commission (in %, 1-100)
    mapping(string => uint256) public topicCommissions;
    // Custom minimum entry for each topic, set by their owner
    mapping(string => uint256) public topicMinimum;

    // POOL related:
    // Total pooled per topic
    mapping(string => uint256) public topicPools;
    // For each topic, how much is the total pooled per side; resultPools[topicID][side]
    mapping(string => mapping(string => uint256)) public resultPools;
    // For each topic, how much each has each user put into that topic's pool; userPools[topicID][msg.sender]
    mapping(string => mapping(address => uint256)) public userPools;
    
    // RESULT related
    // Keep track of when a topic ends and what its result was
    mapping(string => bool) public finishedTopics;
    mapping(string => string) public topicResults;

    // BET DATA
    struct oneBet{
        string topicid;
        address user;
        string side;
        uint256 amt;
    }

    // bets by user
    mapping(address => oneBet[]) allBets;
    // bets by topic
    mapping(string => oneBet[]) allBetsByTopic;

    // For each topic, track how much each user has put into each side
    mapping(string => mapping(address => mapping(string => uint256))) public userBets;

    // For each bet, track which users have already claimed their potential reward
    mapping(string => mapping(address => bool)) public claimedBets;


    // STATE FUNCTIONS
    // Event if there is not enough to pay for oracle: the user should be informed and their funds returned
    // event LackingFunds(address indexed sender, uint256 funds);

    /* Contains all the information that can prove useful to people taking a look at the bet in the frontend. */
    event CreatedBet(string indexed _id, string description, string query);

    function createTopic(string memory topicID, string memory topic, string[] memory sides, uint64 deadline, uint256 minimum, uint256 commission, string memory description, address _arbitrator) public {
        require(
            bytes(topicID).length > 0
            && sides.length > 1
            // comment out deadline validation so that we can create sample topics
            // && deadline > block.timestamp // topic can't be set in the past
            && commission <= 20 // maximum comission is 20%
            && minimum >= minimumBet
            && !createdTopics[topicID], // Can't have duplicate topic ids
            "Unable to create topic, check arguments."
        );

        // Create topic by updating state
        allTopics.push(topicID);
        createdTopics[topicID] = true;
        topicOwners[topicID] = payable(msg.sender);
        topicDeadlines[topicID] = deadline;
        topicSchedules[topicID] = deadline + scheduleThreshold;
        topicMinimum[topicID] = minimum;
        topicCommissions[topicID] = 100/commission;
        topicArbitrator[topicID]= _arbitrator;
        topicSides[topicID] = sides;

        topicList[topicID] = (topics(topicID, topic, sides, deadline, minimum, commission, description, _arbitrator, msg.sender, false, "", 0, false));

        // initialize the sides, set pool for each side to 0
        for (uint i = 0; i < sides.length; i++) {
            resultPools[topicID][sides[i]] = 0;
        }

        emit CreatedBet(topicID, description, topic);
    }

    // The table in the frontend representing each topic's pool is populated according to these events.
    event PlacedBet(address indexed user, string indexed _id, string id, string side);
    
    // only allow user to bet on 1 topic and 1 side each time
    function placeBet(string memory topicID, string memory side) public payable {
        require(
            createdTopics[topicID]
            && !finishedTopics[topicID], 
            // && topicDeadlines[topicID] >= block.timestamp,
        "Unable to place bets, check arguments.");

        uint256 bet = msg.value;

        require(
        bytes(side).length > 0,
        "Attempted to place invalid bet, check result");

        require(
        msg.value >= topicMinimum[topicID],
        "Attempted to place invalid bet, check amount");

        bet -= fixedCommission;

        // Update all required state
        resultPools[topicID][side] += bet;
        userPools[topicID][msg.sender] += bet;
        topicPools[topicID] += bet;
        userBets[topicID][msg.sender][side] += bet;

        allBets[msg.sender].push(oneBet(topicID, msg.sender, side, bet));
        allBetsByTopic[topicID].push(oneBet(topicID, msg.sender, side, bet));

        // Fixed commission transfer
        (bool success, ) = contractCreator.call{value: fixedCommission}("");
        require(success, "Failed to transfer fixed commission to contract creator.");

        emit PlacedBet(msg.sender, topicID, topicID, side);
    }

    // Emit result
    event ReportedResult(string indexed _id, string result);

    // Function executed by oracle when the topic is scheduled to close
    function reportResult(string memory topicID, string memory result) public {
        require(msg.sender == topicArbitrator[topicID] && !finishedTopics[topicID], 'only oracle can report the result');
        
        topicResults[topicID] = result;
        finishedTopics[topicID] = true;
        
        topicList[topicID].finished = true;
        topicList[topicID].result = result;

        emit ReportedResult(topicID, result);
    }
    
    // If the user wins the bet, let them know along with the reward amount.
    event WonBet(address indexed winner, uint256 won);
    
    // If the user lost no funds are claimable.
    event LostBet(address indexed loser);
    
    /* If no one wins the bet the funds can be refunded to the user, 
    after the bet creator's takes their cut. */
    event UnwonBet(address indexed refunded);
    
    function claimBet(string memory topicID) public {
        bool topicExpired = topicSchedules[topicID] + topicThreshold > block.timestamp;
        
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
        uint256 ownerFee = reward / topicCommissions[topicID];
        reward -= ownerFee;
        (bool success, ) = msg.sender.call{value:reward}("");
        require(success, "Failed to transfer reward to user.");
        (success, ) = topicOwners[topicID].call{value:ownerFee}("");
        require(success, "Failed to transfer commission to bet owner.");
    }



    // VIEW functions
    // return all topics
    function getTopics() public view returns (topics[] memory){
        topics[] memory id = new topics[](allTopics.length);
        for (uint i = 0; i < allTopics.length; i++) {
            topics memory member = topicList[allTopics[i]];
            member.userBet = userPools[member.id][msg.sender];
            member.claimed = claimedBets[member.id][msg.sender];
            id[i] = member;
        }
        return id;
    }

    // return one topic 
    function getTopic(string memory id) public view returns (topics memory){
        return topicList[id];
    }

    // return all bets a user has made
    // should address be param or message sender?
    function getUserBets(address _user) public view returns (oneBet[] memory){
        return allBets[_user];
    }

    // return bets by topic
    function getBetsByTopic(string memory topicID) public view returns (oneBet[] memory){
        return allBetsByTopic[topicID];
    }

    struct indivPool{
        string side;
        uint256 amount;
    }
    struct pool{
        string id;
        indivPool[] pools;
    }

    // get pool for a topic
    function getTopicPool() public view returns (pool[] memory){
        pool[] memory pools = new pool[](allTopics.length);
        

        for (uint i = 0; i < allTopics.length; i++) {
            string memory topicid = allTopics[i];
            indivPool[] memory ip = new indivPool[](topicSides[topicid].length);

            for (uint j = 0; j < topicSides[topicid].length; j++) {
                ip[j] = indivPool(topicSides[topicid][j], resultPools[topicid][topicSides[topicid][j]]);
            }

            pools[i] = pool(topicid, ip);
        }

        return pools;
    }

    /*
    // function to check if user has claimed the bet for a topic already

    // function to check if user is owner of a topic
    function isOwner(address person) public view returns (bool result){
        topicOwners
    }
    */
}
