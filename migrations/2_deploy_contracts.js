const PredictionMarket = artifacts.require('PredictionMarket');

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle, {from: admin});
  // await deployer.deploy(PredictionMarket);
  const predictionMarket = await PredictionMarket.deployed();

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

  await predictionMarket.createTopic(
    "71bca7b6-0b72-4a0f-93e5-57db57c53e5c",
    "EPL",
    ["Liverpool", "Manchester City"],
    1765217612,
    200,
    5,
    "Who will win the championship this season?",
    oracle,
    {from: gambler2}
  )
};
