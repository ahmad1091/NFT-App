import React,{useState,useEffect} from 'react';
import axios from 'axios';
import getBlockchain from './ethereum';

function App() {
  const [tokenInfo,setTokenInfo] = useState(undefined);

  useEffect(()=>{
    const init = async ()=>{
      const {nft} = await getBlockchain();
      console.log('inside the init',nft);
      const tokenURI = await nft.tokenURI(0);
      const {data}=await axios.get(tokenURI);
      console.log('datass',data.result.image);
      setTokenInfo(data.result);
    }
    init()
  },[])
  if (typeof tokenInfo === 'undefined') {
    return 'loading..'
  }
  return (
    <div className="App">
    <h1>{tokenInfo.name}</h1>
    <p>{tokenInfo.description}</p>
    <img src={tokenInfo.image} />
    </div>
  );
}

export default App;
