const PredictionMarket = artifacts.require('PredictionMarket');

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle, {from: admin});
  // await deployer.deploy(PredictionMarket);
  const predictionMarket = await PredictionMarket.deployed();

  // topic with betting closed but not resolved yet
  await predictionMarket.createTopic(
    "ac420079-ad12-4ca5-868c-0aa07a14afb6", 
    "NBA Playoff Final", 
    ['Warriors','Celtics'],
    // Saturday, 1 October 2022
    1664582400, 
    150, 
    10,
    "Who will win the NBA Playoff Finals?",
    oracle,
    {from: gambler1}
  );
  
  await predictionMarket.placeBet(
    "ac420079-ad12-4ca5-868c-0aa07a14afb6", 
    "Warriors", 
    {from: gambler2, value: web3.utils.toWei('2', 'ether')}
  );

  await predictionMarket.placeBet(
    "ac420079-ad12-4ca5-868c-0aa07a14afb6", 
    "Celtics", 
    {from: gambler3, value: web3.utils.toWei('20', 'ether')}
  );

  // topic with betting closed and resolution date over
  await predictionMarket.createTopic(
    "7c2ab882-c9d5-41e6-9ec5-26d8ae1299f6", 
    "Most handsome male celebrity of 2022", 
    ['Timothee Chalamet','Shawn Mendes'],
    // Thursday, 1 September 2022
    1661990400, 
    110, 
    10,
    "By TC Candler",
    oracle,
    {from: gambler1}
  );

  await predictionMarket.placeBet(
    "7c2ab882-c9d5-41e6-9ec5-26d8ae1299f6", 
    "Timothee Chalamet", 
    {from: gambler3, value: web3.utils.toWei('1', 'ether')}
  );

  await predictionMarket.placeBet(
    "7c2ab882-c9d5-41e6-9ec5-26d8ae1299f6", 
    "Shawn Mendes", 
    {from: gambler4, value: web3.utils.toWei('10', 'ether')}
  );

  await predictionMarket.reportResult(
    "7c2ab882-c9d5-41e6-9ec5-26d8ae1299f6", 
    "Shawn Mendes", 
    {from: oracle}
  );

  await predictionMarket.createTopic(
    "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
    "US Election", 
    ['Biden','Trump'],
    1765238400, 
    101, 
    10,
    "Who will win the US Election?",
    oracle,
    {from: gambler1}
  );

  await predictionMarket.placeBet(
    "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
    "Biden", 
    {from: gambler2, value: web3.utils.toWei('15', 'ether')}
  );

  await predictionMarket.placeBet(
    "6bba15ab-8667-47e2-98b4-643191bfc6a3", 
    "Trump", 
    {from: gambler2, value: web3.utils.toWei('2', 'ether')}
  );

  await predictionMarket.createTopic(
    "71bca7b6-0b72-4a0f-93e5-57db57c53e5c",
    "EPL",
    ["Liverpool", "Manchester City"],
    1765238400,
    200,
    5,
    "Who will win the championship this season?",
    oracle,
    {from: gambler2}
  )

};
