import "./styles.css";
import "./display.css";

import React from "react";
import { ethers } from "ethers";
const el = require("./elements");
const dx = require("./dexes");

var ftm_main_url = "https://rpc.ftm.tools/";

const weth_address = ethers.utils.getAddress(dx.token_address["FTM"]);
const weth_decimal = 18;
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
    token0_symbol: "FTM",
    token1_symbol: "WBTC",
    token0_address: dx.token_address["FTM"],
    token1_address: dx.token_address["WBTC"],
    conn
  };
  const swap = el.getSwapPrice(swap_request);

  if (swap) {
    return swap;
  } else {
    console.log("Error obtaining swap details");
    return "NO DATA";
  }
}
//      token0_symbol: pq.token0_symbol,
//      token1_symbol: pq.token1_symbol,
//      ask_price: "NA",
//      bid_price: "NA",
//      token_out: "NA",
//      eth_in: "NA",
//      token_in: "NA",
//      eth_out: "NA",
//      dex_ask: pq.dex_ask,
//      dex_bid: pq.dex_bid
//<li> <%= iti.dex_ask %> <%= iti.dex_bid%> <%= iti.token1_symbol%> <%= iti.eth_out%>
const DisplaySwap = ({ token0, token1, dexa, dexb, conn }) => {
  const [swap, setSwap] = React.useState(0);
  console.log(swap);
  React.useEffect(() => {
    getSwap(token0, token1, dexa, dexb, conn).then((swap) => {
      setSwap(swap);
    });
  }, [token0, token1, dexa, dexb]);
  return (
    <div>
      {swap.token0_symbol} {swap.dex_ask} : {swap.token1_symbol} {swap.dex_bid}{" "}
      : {swap.eth_out} <br />
    </div>
  );
};

export default function ArbApp() {
  const [isLit, setLit] = React.useState(false);
  const [token0, setToken0] = React.useState("LQDR");
  const [token1, setToken1] = React.useState("FTM");
  const [dexa, setDexa] = React.useState("spooky");
  const [dexb, setDexb] = React.useState("spirit");
  const brightness = isLit ? "lit" : "dark";
  return (
    <div className={`App ${brightness}`}>
      <div align="left">
        Displays stuff Color {isLit ? "lit" : "dark"}
        <button onClick={() => setLit(!isLit)}>flip color</button>
        <br /> Token:
        <button onClick={() => setToken0("DAI")}>DAI</button>
        <button onClick={() => setToken1("LQDR")}>LQDR</button>
        <br /> Dex:
        <button onClick={() => setDexa("spooky")}>Spooky</button>
        <button onClick={() => setDexa("spirit")}>Spirit</button>
        <br /> Dex:
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
