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

        // added oracle info
        const oracle = "0xBF1d2d8d9e8F1CA9087DB57d33c05eCE65C40cf9"

        const predictionMarket = new Contract(
          PredictionMarket.networks[window.ethereum.networkVersion].address,
          PredictionMarket.abi,
          signer
        );

        resolve({signerAddress, predictionMarket, oracle});
      }
      resolve({signerAddress: undefined, predictionMarket: undefined, oracle: false});
    });
  });

export default getBlockchain;
