import React, { useState, useEffect } from "react";
// import getBlockchain from "./ethereum.js";
import axios from "axios";
import { ethers, Contract } from 'ethers';
import NFT from './contracts/NFT.json';
import {useForm}  from './useForm'
function App() {
  const [tokenInfo, setTokenInfo] = useState(undefined);
  const [addresses,handleAddressChange] = useForm({tokenAddress:'0x6611D7ca12c1E4286Dd1B65C665b821ce45159Be',toAddress:'',tokenId:0})

  const handleChange = (e) => {
    handleAddressChange(e)
  };

  const getBlockchain =  async () =>
   new Promise((resolve, reject) => {
        if(window.ethereum) {(async () =>{
          console.log('tojen address',addresses.tokenAddress);
          if (!window.ethereum.isConnected()) {
            console.log('tring to enable the connector');
            await window.ethereum.enable();
          } 
  
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nft = new Contract(
            addresses.tokenAddress,
            NFT.abi,
            signer
          );
          console.log('helloooooooo',nft)
          resolve({nft});
        })()
        }
        resolve({nft: undefined});
    });
  
  const handleClick = () => {
    const init = async () => {
      const { nft } = await getBlockchain();
      console.log(nft);
      const tokenURI = await nft.tokenURI(addresses.tokenId);
      console.log('tokenURI///////',tokenURI);
      const { data } = await axios.get(tokenURI);
      console.log("dataaaaaaaaaaaa", data.result);
      setTokenInfo(data.result);
    };
    init();
  };

  const mintTokens = ()=>{
if (!addresses.toAddress) {
  console.log('Soory there is no address tso mint');
}
  }

  useEffect(() => {
    const init = async () => {
      if (!addresses.tokenAddress) {
        const { nft } = await getBlockchain();
        const tokenURI = await nft.tokenURI(0);
        const { data } = await axios.get(tokenURI);
        console.log("data", data.result);
        setTokenInfo(data.result);
      } else {
        const { nft } = await getBlockchain(addresses.tokenAddress);
        const tokenURI = await nft.tokenURI(0);
        const { data } = await axios.get(tokenURI);
        console.log("data", data.result);
        setTokenInfo(data.result);
      }
    };
    init();
  }, []);

  if (typeof tokenInfo === "undefined") {
    return "Loading...";
  }

  return (
    <div className="container">
      <h1 className="display-3">NFT viewer</h1>
      <input type="text" className="form-control" name="tokenAddress" onChange={handleChange} placeholder="NFT token Address" />
      <input type="text" className="form-control" name="tokenId" onChange={handleChange} placeholder="Token Id"/>
      
      <input
        className="btn btn-primary"
        type="submit"
        value="Submit"
        onClick={handleClick}
      />
<br/>
<br/>
<input type="text" className="form-control" name="toAddress" onChange={handleChange} placeholder="Send to"/>
      
      <input
        className="btn btn-primary"
        type="submit"
        value="Mint"
        onClick={mintTokens}
      />

      <div className="row">
        <div className="col-sm-12">
          <h1 className="text-center">{tokenInfo.name}</h1>
          <div className="jumbotron">
            <p className="lead text-center">{tokenInfo.description}</p>
            <img src={tokenInfo.image} className="rounded mx-auto d-block img-fluid img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
