const PredictionMarket = artifacts.require('PredictionMarket.sol');
  
contract('PredictionMarket', addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it('binary workflow', async () => {
    const predictionMarket = await PredictionMarket.new(oracle, {from: admin});
    // const predictionMarket = await PredictionMarket.new();

    const balancesBefore = (await Promise.all( 
      [admin, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));

    console.log(balancesBefore);

    // createBet(string memory topicID, string memory topic, string[] memory sides, 
    // uint64 deadline, uint64 schedule, uint256 minimum, uint256 initialPool, string memory description)
    await predictionMarket.createTopic(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "US Election", 
      ['biden','trump'],
      1765217612, 
      1765217612, 
      2, 
      "description",
      {from: gambler1}
    );

    const balances1 = (await Promise.all( 
      [admin, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));

    console.log(balances1);

    // string memory topicID, string memory side, uint256 bet
    await predictionMarket.placeBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "biden", 
      {from: gambler2, value: web3.utils.toWei('5', 'ether')}
    );

    const balances2 = (await Promise.all( 
      [admin, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));

    console.log(balances2);

    await predictionMarket.placeBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "trump", 
      {from: gambler3, value: web3.utils.toWei('5', 'ether')}
    );

    const balances3 = (await Promise.all( 
      [admin, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));

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
      [admin, gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => (balance));

    console.log(balances4);
  });
});
