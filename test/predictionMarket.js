const PredictionMarket = artifacts.require('PredictionMarket.sol');
  
contract('PredictionMarket', addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it('binary workflow', async () => {
    const predictionMarket = await PredictionMarket.new(oracle, {from: admin});
    // const predictionMarket = await PredictionMarket.new();

    const balancesBefore = (await Promise.all( 
      [admin, oracle, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));

    console.log('balances before');
    console.log(balancesBefore);

    // createTopic(string memory topicID, string memory topic, string[] memory sides, 
    // uint64 deadline, uint256 minimum, uint256 commission, string memory description, address _arbitrator)
    await predictionMarket.createTopic(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "US Election", 
      ['biden','trump'],
      1765217612, 
      101, 
      10,
      "description",
      oracle,
      {from: gambler1}
    );

    const balances1 = (await Promise.all( 
      [admin, oracle, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));
    console.log('gambler 1 created topic')
    console.log(balances1);

    // string memory topicID, string memory side, uint256 bet
    await predictionMarket.placeBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "biden", 
      {from: gambler2, value: web3.utils.toWei('5', 'ether')}
    );

    const balances2 = (await Promise.all( 
      [admin, oracle, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));
    console.log('gambler 2 placed bet')
    console.log(balances2);

    await predictionMarket.placeBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "trump", 
      {from: gambler3, value: web3.utils.toWei('5', 'ether')}
    );

    const balances3 = (await Promise.all( 
      [admin, oracle, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));
    console.log('gambler 3 placed bet')
    console.log(balances3);
    
    await predictionMarket.reportResult(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3",
      "trump",
      {from: oracle}
    )
    // .then(result => console.log(result.logs[0].args))

    await predictionMarket.claimBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3",
      {from: gambler2},
    )
    // .then(result => console.log(result.logs[0].args))

    await predictionMarket.claimBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3",
      {from: gambler3},
    )
    // .then(result => console.log(result.logs[1].args))

    const balances4 = (await Promise.all( 
      [admin, oracle, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));
    console.log('final balances');
    console.log(balances4);
  
  const topics = (await predictionMarket.getTopics()).map(balance => (balance));
  console.log(topics);

  const x = (await predictionMarket.getTopic("6bba15ab-8667-47e2-98b4-643191bfc6a3")).map(balance => (balance));
  console.log(x);

  const balances5 = (await Promise.all( 
    [admin, oracle, gambler1, gambler2, gambler3, gambler4].map(gambler => (
      web3.eth.getBalance(gambler)
    ))
  ))
  .map(balance => (balance));
  console.log('check view');
  console.log(balances5);

  const bets1 = (await predictionMarket.getUserBets(gambler2));
  console.log(bets1);

  const bets2 = (await predictionMarket.getBetsByTopic("6bba15ab-8667-47e2-98b4-643191bfc6a3"));
  console.log(bets2);
  
  const sides = (await predictionMarket.getTopicPool("6bba15ab-8667-47e2-98b4-643191bfc6a3"));
  console.log(sides);
});
});
