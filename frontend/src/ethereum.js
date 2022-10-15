import { ethers, Contract } from 'ethers';
import PredictionMarket from './contracts/PredictionMarket.json';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const predictionMarket = new Contract(
          PredictionMarket.networks[window.ethereum.networkVersion].address,
          PredictionMarket.abi,
          signer
        );

        // added oracle info
        const oracle = await predictionMarket.getOracle();

        resolve({signerAddress, predictionMarket, oracle});
      }
      resolve({signerAddress: undefined, predictionMarket: undefined, oracle: false});
    });
  });

export default getBlockchain;
