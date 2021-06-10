import React, { useState, useEffect } from "react";
// import getBlockchain from "./ethereum.js";
import axios from "axios";
import { ethers, Contract } from 'ethers';
import NFT from './contracts/NFT.json';
import {useForm}  from './useForm'
function App() {
  const [tokenInfo, setTokenInfo] = useState([]);
  const [addresses,handleAddressChange] = useForm({tokenAddress:'0x6611D7ca12c1E4286Dd1B65C665b821ce45159Be',toAddress:'',tokenId:0,accountAddress:''})

  const handleChange = (e) => {
    handleAddressChange(e)
  };

  const getBlockchain =  async (add) =>
   new Promise((resolve, reject) => {
        if(window.ethereum) {(async () =>{
          if (!window.ethereum.isConnected()) {
            await window.ethereum.enable();
          } 
  
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nft = new Contract(
            add,
            NFT.abi,
            signer
          );
          resolve({nft});
        })()
        }
        resolve({nft: undefined});
    });
  
  const handleClick = () => {
    const init = async () => {
      const { nft } = await getBlockchain(addresses.tokenAddress);
      const tokenURI = await nft.tokenURI(addresses.tokenId);
      const { data } = await axios.get(tokenURI);
      const tokenInfoArr = tokenInfo
      tokenInfoArr.push(data.result)
      setTokenInfo(tokenInfoArr);
    };
    init();
  };

  const mintTokens = async()=>{
if (addresses.toAddress && addresses.tokenAddress ) {
  const { nft } = await getBlockchain(addresses.tokenAddress);
  const minted = await nft.mint(addresses.toAddress);
  console.log(minted);
}else{
  console.log('Sorry incomplete data');
}
  }
  const getNFT = ()=>{
    if (addresses.accountAddress) {
      const url = `https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&address=${addresses.accountAddress}&startblock=0&endblock=999999999&sort=asc&apikey=5MZTGRII31FUWC2TIU61FFVBAW8K88UF31`
      axios.get(url).then((res)=>{
        const {result } = res.data;
        const filterdArr = result.filter((e)=> e.timeStamp>=1623066998).map((e)=> e.contractAddress);
        const uniqedArray = [...new Set(filterdArr)];
        uniqedArray.map(async(e)=>{
          const { nft } = await getBlockchain(e);
          const tokenURI = await nft.tokenURI(addresses.tokenId);
          console.log('tokenURI/|/|/|/|/|/|/|/',tokenURI);
          const { data } = await axios.get(tokenURI);
          console.log("data inside the getter", data.result);
          const tokenInfoArr = tokenInfo
          tokenInfoArr.push(data.result)
          setTokenInfo(tokenInfoArr);
        })
      }).catch((err)=>{
        console.error(err);
      })
    }
  }

  useEffect(() => {
    const init = async () => {
        const { nft } = await getBlockchain(addresses.tokenAddress);
        const tokenURI = await nft.tokenURI(0);
        const { data } = await axios.get(tokenURI);
        const tokenInfoArr = tokenInfo
        tokenInfoArr.push(data.result)
        setTokenInfo(tokenInfoArr);
    };
    init();
  }, [tokenInfo]);

  if (typeof tokenInfo === "undefined") {
    return "Loading...";
  }

  return (
    <div className="container">
      <h1 className="display-1">NFT viewer</h1>
      <hr/>
      <h3 >Get NFT Using token address and token ID</h3>
      <input type="text" className="form-control" name="tokenAddress" onChange={handleChange} placeholder="NFT token Address" />
      <input type="text" className="form-control" name="tokenId" onChange={handleChange} placeholder="Token Id"/>
      
      <input
        className="btn btn-primary"
        type="submit"
        value="Submit"
        onClick={handleClick}
      />
<hr/>
<h3 >Mint new tokens</h3>
<input type="text" className="form-control" name="tokenAddress" onChange={handleChange} placeholder="NFT token Address"/>
<input type="text" className="form-control" name="toAddress" onChange={handleChange} placeholder="Send to"/>
      
      <input
        className="btn btn-primary"
        type="submit"
        value="Mint"
        onClick={mintTokens}
      />
<hr/>
<h3 >GET NFT by Account Address</h3>
<input type="text" className="form-control" name="accountAddress" onChange={handleChange} placeholder="your account address"/>
      
      <input
        className="btn btn-primary"
        type="submit"
        value="GET NFT"
        onClick={getNFT}
      />
<br/>
<hr/>
<>
{tokenInfo.length>0 && tokenInfo.map((e)=>{
     return <div className="row">
        <div className="col-sm -12">
          <h1 className="text-center">{e.name}</h1>
          <div className="jumbotron">
            <p className="lead text-center">{e.description}</p>
            <img src={e.image} className="rounded mx-auto d-block img-fluid img" />
          </div>
        </div>
      </div>
})}
    </>
</div>
  );
}

export default App;
