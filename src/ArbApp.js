import "./styles.css";
import "./display.css";

import React from "react";
import { ethers } from "ethers";
import * as el from "./elements.js";
import * as dx from "./dexes.js";
import * as ui from "./useInterval.js";

var ftm_main_url = "https://rpc.ftm.tools/";

//const weth_address = ethers.utils.getAddress(dx.token_address["FTM"]);
var eth_in = "1";

function get_connection() {
  //provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(ftm_main_url);
  return provider;
}

var conn = get_connection();

async function getSwap(token0, token1, dexa, dexb, conn) {
  const swap_request = {
    eth_in: eth_in,
    dex_ask: "spirit",
    dex_bid: "spooky",
    token0_symbol: token0,
    token1_symbol: token1,
    token0_address: dx.token_address[token0],
    token1_address: dx.token_address[token1],
    conn
  };
  const swap = el.getSwapPrice(swap_request);

  if (swap) {
    console.log("Got swap data");
    return swap;
  } else {
    console.log("Error obtaining swap details");
    return "NO DATA";
  }
}

const DisplaySwap = ({ token0, token1, dexa, dexb, conn }) => {
  const [swap, setSwap] = React.useState(0);
  console.log(swap);
  ui.useInterval(() => {
    getSwap(token0, token1, dexa, dexb, conn).then((swap) => {
      console.log(swap);
      setSwap(swap);
    });
  }, 10000);
  //}
  return (
    <div>
      {swap.token0_symbol} {swap.dex_ask} : {swap.token1_symbol} {swap.dex_bid}{" "}
      : {swap.eth_out} <br />
    </div>
  );
};

export default function App() {
  const [isLit, setLit] = React.useState(false);
  const [token0, setToken0] = React.useState("LQDR");
  const [token1, setToken1] = React.useState("FTM");
  const [dexa, setDexa] = React.useState("spooky");
  const [dexb, setDexb] = React.useState("spirit");
  const brightness = isLit ? "lit" : "dark";
  console.log(dx.tokenABI);
  return (
    <div className={`App ${brightness}`}>
      <div align="left">
        Basic Arbitrage Opportunity Tracker {isLit ? "lit" : "dark"}
        <button onClick={() => setLit(!isLit)}>Day/Night mode</button>
        <br />| Start Token:
        <button onClick={() => setToken0("FTM")}>FTM</button>
        <button onClick={() => setToken0("LQDR")}>LQDR</button>| Dex:
        <button onClick={() => setDexa("spooky")}>Spooky</button>
        <button onClick={() => setDexa("spirit")}>Spirit</button>
        <br />| Middle Token:
        <button onClick={() => setToken1("FTM")}>FTM</button>
        <button onClick={() => setToken1("LQDR")}>LQDR</button>| Dex:
        <button onClick={() => setDexb("spooky")}>Spooky</button>
        <button onClick={() => setDexb("spirit")}>Spirit</button>
        <br />
        <DisplaySwap
          token0={token0}
          token1={token1}
          dexa={dexa}
          dexb={dexb}
          conn={conn}
        />
        <br />
      </div>
    </div>
  );
}

//export default function ArbApp() {
// console.log("success");
///}
