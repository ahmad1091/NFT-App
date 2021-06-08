import React, { useState, useEffect } from "react";
import getBlockchain from "./ethereum.js";
import axios from "axios";

function App() {
  const [tokenInfo, setTokenInfo] = useState(undefined);
  const [tokenaddress, setTokenadress] = useState("");

  const handleChange = (e) => {
    setTokenadress(e.target.value);
  };

  const handleClick = () => {
    const init = async () => {
      console.log("what is the data inside", tokenaddress);
      const { nft } = await getBlockchain(tokenaddress);
      const tokenURI = await nft.tokenURI(0);
      const { data } = await axios.get(tokenURI);
      console.log("dataaaaaaaaaaaa", data.result);
      setTokenInfo(data.result);
    };
    init();
  };

  useEffect(() => {
    const init = async () => {
      if (!tokenaddress) {
        const { nft } = await getBlockchain(
          "0x4f97b73bf9e3C915f80E0767FE8774677E02B2DE"
        );
        const tokenURI = await nft.tokenURI(0);
        const { data } = await axios.get(tokenURI);
        console.log("data", data.result);
        setTokenInfo(data.result);
      } else {
        const { nft } = await getBlockchain(tokenaddress);
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
      <input type="text" className="form-control" onChange={handleChange} />
      <input
        className="btn btn-primary"
        type="submit"
        value="Submit"
        onClick={handleClick}
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
