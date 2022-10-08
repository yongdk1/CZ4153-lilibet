const PredictionMarket = artifacts.require('PredictionMarket');

const Side = {
  Biden: 0,
  Trump: 1
};

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  // await deployer.deploy(PredictionMarket, oracle);
  await deployer.deploy(PredictionMarket);
  const predictionMarket = await PredictionMarket.deployed();
};
