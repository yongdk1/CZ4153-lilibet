# CZ4153-lilibet
Prediction Market utilising Ethereum, Truffle, and ReactJS
=======
# CZ4153-lilibet
Prediction Market utilising Ethereum, Truffle, and ReactJS

A Platform for users to create and participate in prediction markets. 

## Dependencies
Ensure npm is installed

Run `npm install truffle` to install truffle

## Quick Start
Solidity `0.8.17` is used.

To compile contracts, run `truffle compile`

To deploy, run
`truffle develop` > `migrate --reset` > `deploy`

To launch website, in another shell run the commands `cd frontend`, `npm install`, `npm start`

## Key Functionalities

### Create a Topic
Users can open new topic (a new prediction market) with 
1. Topic Name
2. Description
3. Outcome options to bet on (2 or More)
4. Deadline for betting to close (resolution deadline is default 30 days after betting closes)
5. Arbitrator identity (can be default oracle, or topic owner)
6. Commision to Topic Owner (max Commission is 20%)
7. Minimum bet value (> 100 Wei, as Fixed Commission to contract owner is 100 Wei)

### Place Bets
Minimum bet value is 100 Wei or as specified by Topic Owner, whichever is higher
1. Bet on a topic and a side for each bet
2. Bet value is message value - fixed comission of 100 Wei

### Reporting Results
1. Only the specified arbitrator identity (the trusted judge after the event occurs) can report the results
2. Specified arbitrator can only resolve after betting closes and before the arbitrator resolution deadline

### Claiming Bets
1. Winners will claim winnings - corressponding commission to topic owner
2. User will not be able to claim if lost
3. If no one won, then all bets are refunded

### User Bets
1. Users can see all past bets made on the various topics
2. Users will be able to see if their bets have been claimed

