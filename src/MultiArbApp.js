import "./styles.css";
import "./display.css";

import React from "react";
import { ethers } from "ethers";
import * as el from "./elements.js";
import * as dx from "./dexes.js";
import * as ui from "./useInterval.js";
import { createIndexSignature } from "typescript";

var ftm_main_url = "https://rpc.ftm.tools/";

//const weth_address = ethers.utils.getAddress(dx.token_address["FTM"]);
var eth_in = "1";

function get_connection() {
  //provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(ftm_main_url);
  return provider;
}

var conn = get_connection();

function cutSwaps(swps) {
  return swps.map((sp) => [sp.token1_symbol, sp.eth_out]);
}

const DisplaySwaps = ({ conn }) => {
  const [tokens, setTokens] = React.useState(0);
  const [items, setItems] = React.useState(0);
  const [swaps, setSwaps] = React.useState(0);
  console.log(swaps);
  React.useEffect(() => {
    //ui.useInterval(() => {
    const interval = setInterval(() => {
      console.log("This will run every 10 second!");
      const tokens = ["LQDR", "ETH", "DAI", "WBTC", "SPA"];
      var items = el.getSwapList(tokens);
      console.log(items);
      setItems(items);
      setTokens(tokens);
      el.getSwaps(items)
        .then((swapOutputs) => {
          //const jc = cutSwaps(swapOutputs);
          console.log(swapOutputs);
          setSwaps(swapOutputs);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  //}, 10000);
  //}createIndexSignature
  if (swaps !== 0) {
    return (
      <div>
        <ul>
          {swaps.map((item, index) => (
            <li key={index}>
              {item.dex_ask}, {item.token0_symbol}, {item.token1_symbol}{" "}
              {item.eth_out}{" "}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return <div>{".."}</div>;
};

//{tokens.map((item, index) => (
//  <li key={index}>{item}</li>
//))}
//{swap.token0_symbol} {swap.dex_ask} : {swap.token1_symbol}{" "}
//{swap.dex_bid} : {swap.eth_out}{" "}

export default function App() {
  const [isLit, setLit] = React.useState(false);
  const brightness = isLit ? "lit" : "dark";
  //console.log(dx.tokenABI);
  return (
    <div className={`App ${brightness}`}>
      <div align="left">
        Basic Arbitrage Opportunity Tracker {isLit ? "lit" : "dark"}
        <button onClick={() => setLit(!isLit)}>Day/Night mode</button>
        <br />
        <DisplaySwaps conn={conn} />
        <br />
      </div>
    </div>
  );
}

//export default function ArbApp() {
// console.log("success");
///}
