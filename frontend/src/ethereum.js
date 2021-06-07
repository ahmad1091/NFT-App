import {ethers,Contract} from 'ethers';
import NFT from './contracts/NFT.json';

const getBlockchain = ()=>{
  return  new Promise((resolve,reject)=>{
        window.addEventListener('load',async ()=>{
            if (window.ethereum) {
                console.log('NFTTTT',NFT);
                //first we enable the etherum connector form window.etherum
               await window.ethereum.enable();
               //second we get the procvider from the ethers instance
               const provider = new ethers.providers.Web3Provider(window.ethereum);
               //then finally we get the signer from the provider
               const signer = provider.getSigner();

               const nft = new Contract(
                   NFT.networks[window.ethereum.networkVersion].address,
                   NFT.abi,
                   signer
               );
               
               resolve({nft})
            }
            resolve({nft:undefined})
        })
    })
}

export default getBlockchain;