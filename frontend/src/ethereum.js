import { ethers, Contract } from 'ethers';
import NFT from './contracts/NFT.json';

const getBlockchain =  async (address) =>{
  const nftAddress = address;
return new Promise((resolve, reject) => {
      if(window.ethereum) {(async () =>{
        if (!window.ethereum.isConnected()) {
          console.log('tring to enable the connector');
          await window.ethereum.enable();
        } 

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nft = new Contract(
          nftAddress,
          NFT.abi,
          signer
        );
        
        console.log('helloooooooo',nft)
        resolve({nft});
      })()
      }
      resolve({nft: undefined});
  });
}
export default getBlockchain;
// '0x4f97b73bf9e3C915f80E0767FE8774677E02B2DE',
//0xb2db3F6F72f2C3F5D323C6c47EE9ae99820CFC93,
//0x6611D7ca12c1E4286Dd1B65C665b821ce45159Be,
