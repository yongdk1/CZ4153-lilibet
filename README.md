# CZ4153-lilibet
Prediction Market utilising Ethereum, Truffle, and ReactJS
=======
# CZ4153-lilibet
Prediction Market utilising Ethereum, Truffle, and ReactJS

A Platform for users to create and participate in prediction markets. 

## Quick Start
Solidity `0.8.17` is used.

`truffle compile`

`truffle develop` > `migrate --reset` > `deploy`

## Key Functionalities

### Create a Topic
Users can open new topic (a new prediction market) with 
1. Topic Name
2. Outcome options to bet on (2 or More)
3. Deadline for betting to close (resolution deadline is 30 days after betting closes)
4. Minimum bet value (> 100 Wei, as Fixed Commission to contract owner is 100 Wei)
5. Commision to Topic Owner (max Commission is 20%)
6. Description
7. Arbitrator identity (can be default oracle, or topic owner)

### Place Bets
Minimum bet value is 100 Wei or as specified by Topic Owner, whichever is higher
1. Bet on a topic and a side for each bet
2. Bet value is message value - fixed comission of 100 Wei

### Reporting Results
Only the specified arbitrator identity (the trusted judge after the event occurs) can report the results

### Claiming Bets
1. Winners will claim winnings - corressponding commission to topic owner
2. User will not be able to claim if lost
3. If no one won, then all bets are refunded


