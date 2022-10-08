const PredictionMarket = artifacts.require('PredictionMarket.sol');
  
contract('PredictionMarket', addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it('should work', async () => {
    // const predictionMarket = await PredictionMarket.new(oracle);
    const predictionMarket = await PredictionMarket.new();

    // createBet(string memory topicID, string memory topic, string[] memory sides, 
    // uint64 deadline, uint64 schedule, uint256 commission, uint256 minimum, uint256 initialPool, string memory description)
    await predictionMarket.createBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "US Election", 
      ['biden','trump'],
      1765217612, 
      1765217612,
      10, 
      2, 
      5, 
      "description",
      {from: gambler1, value: web3.utils.toWei('10')}
    );

    // string memory topicID, string memory side, uint256 bet
    await predictionMarket.placeBet(
      "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
      "biden", 
      3,
      {from: gambler1, value: web3.utils.toWei('3')}
    );
  /*  
    await predictionMarket.placeBet(
      Side.Biden, 
      {from: gambler1, value: web3.utils.toWei('1')}
    );

    await predictionMarket.reportResult(
      Side.Biden, 
      Side.Trump, 
      {from: oracle}
    );

    const balancesBefore = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));
    await Promise.all(
      [gambler1, gambler2, gambler3].map(gambler => (
        predictionMarket.withdrawGain({from: gambler})
      ))
    );
    const balancesAfter = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    //gambler 1, 2, 3 should have respectively 2, 2 and 4 extra ether
    //but we also have to take into consideration gas spent when calling
    //withdrawGain(). We can ignore this problem by just comparing
    //the first 3 digits of balances
    assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === '199');
    assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === '199');
    assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === '399');
    assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
  */
  });
});
