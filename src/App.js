import "./styles.css";
import "./display.css";

import React from "react";
import ReactDOM from "react-dom";
import { ethers } from "ethers";

const tokenABI = require("./abi/token.json");
const factoryABI = require("./abi/factory.json");
const routerABI = require("./abi/router.json");
const pairABI = require("./abi/pairs.json");

var ftm_main_url = "https://rpc.ftm.tools/";

let factory_address = {
  spooky: "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3",
  spirit: "0xEF45d134b73241eDa7703fa787148D9C9F4950b0"
};

let router_address = {
  spooky: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  spirit: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52"
};

let token_address = {
  FTM: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  ETH: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  DAI: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
  LQDR: "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9",
  SPA: "0x5602df4a94eb6c680190accfa2a475621e0ddbdc"
};

const weth_address = ethers.utils.getAddress(token_address["FTM"]);
const weth_decimal = 18;

function get_connection() {
  //provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(ftm_main_url);
  return provider;
}

var conn = get_connection();

async function getPair(token0_address, token1_address, factory, conn) {
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  const pair_address = await factory_contract.getPair(
    token0_address,
    token1_address
  );
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  if (pair_contract) {
    return pair_address;
  } else {
    console.log("Error obtaining pair contract");
    return "No pair address";
  }
}

async function getReserves(token, factory, conn) {
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  var reserves = false;
  const token_contract = new ethers.Contract(token, tokenABI, conn);
  const token_decimal = await token_contract.decimals();
  const pair_address = await factory_contract.getPair(token, weth_address);
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  var token0_address = await pair_contract.token0();
  var token1_address = await pair_contract.token1();
  token0_address = ethers.utils.getAddress(token0_address);
  token1_address = ethers.utils.getAddress(token1_address);
  try {
    reserves = await pair_contract.getReserves();
    console.log(reserves);
  } catch (err) {
    console.log("Error obtaining reserves (2)");
  }
  if (token0_address == weth_address) {
    console.log("eth first");
    var token_amnt = reserves[1];
    var weth_amnt = reserves[0];
  } else if (token1_address == weth_address) {
    console.log("eth second");
    var token_amnt = reserves[0];
    var weth_amnt = reserves[1];
  } else {
    console.log("Error matching weth)");
    console.log(token0_address);
    console.log(token1_address);
    console.log(weth_address);
    return "Y";
  }

  if (reserves) {
    console.log("reserve to number");
    console.log(token_amnt);
    //console.log(reserves[0].toBigInt());
    //let //reserve_ethgwei = token_amnt.toBigInt().toString(),
    //reserve_tokengwei = weth_amnt.toBigInt().toString(),
    let reserve_token = token_amnt / Math.pow(10, token_decimal);
    let reserve_weth = weth_amnt / Math.pow(10, weth_decimal);
    console.log(reserve_token);
    console.log(token_decimal);
    var reserveout = { reserve_weth, reserve_token, token_decimal };
    return reserveout;
  } else {
    console.log("Error obtaining reserves (3. ftm pair)");
    return "X";
  }
}

const DisplayPair = ({ token, factory, conn }) => {
  const [pair, setPair] = React.useState(0);
  const [reserves, setReserves] = React.useState(0);
  console.log(pair);
  React.useEffect(() => {
    getPair(token_address[token], weth_address, factory, conn).then((pair) => {
      setPair(pair);
    });
    getReserves(token_address[token], factory, conn).then((reserves) => {
      setReserves(reserves);
    });
  }, [token, factory]);
  return (
    <div>
      Pair: {token} / FTM <br />
      {"Contract:"} {pair} <br />
      {"Reserves:"} {reserves.reserve_token} / {reserves.reserve_weth} <br />
    </div>
  );
};

async function getFTMReservesPrice(token, factory, conn) {
  const token_contract = new ethers.Contract(token, tokenABI, conn);
  const token_decimal = await token_contract.decimals();
  var reserves = false;
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  const pair_address = await factory_contract.getPair(token, weth_address);
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  try {
    reserves = await pair_contract.getReserves();
  } catch (err) {
    console.log("Error obtaining reserves (1)");
  }
  if (reserves) {
    // check if ftm is first or second
    console.log(pair_contract);
    console.log(reserves[0]);
    var token0_address = await pair_contract.token0();
    var token1_address = await pair_contract.token1();
    token0_address = ethers.utils.getAddress(token0_address);
    token1_address = ethers.utils.getAddress(token1_address);
    if (token0_address == weth_address) {
      console.log("eth first");
      var token_amnt = reserves[1];
      var weth_amnt = reserves[0];
    } else if (token1_address == weth_address) {
      console.log("eth second");
      var token_amnt = reserves[0];
      var weth_amnt = reserves[1];
    } else {
      console.log("Error matching weth)");
      console.log(token0_address);
      console.log(token1_address);
      console.log(weth_address);
      return "Y";
    }
    var reserves_ratio = weth_amnt / token_amnt;
    //reserves_price = token_amnt / weth_amnt;
    const factor = Math.pow(10, weth_decimal) / Math.pow(10, token_decimal);
    const adjusted_reserves_price = reserves_ratio / factor;
    console.log(reserves);
    console.log(reserves[0]);
    console.log(factor);
    var reserveout = { reserves_ratio, adjusted_reserves_price };
    return reserveout;
  } else {
    console.log("Error obtaining reserves (ftm pair)");
    return "X";
  }
}

async function RouterPrice(token, router_address, conn) {
  const token_contract = new ethers.Contract(token, tokenABI, conn);
  const token_decimal = await token_contract.decimals();
  const router_contract = new ethers.Contract(router_address, routerABI, conn);
  const eth_in_wei = ethers.utils.parseUnits("1.00");
  const factor = Math.pow(10, weth_decimal) / Math.pow(10, token_decimal);
  const amount_out_token = await router_contract.getAmountsOut(eth_in_wei, [
    weth_address,
    token
  ]);
  if (amount_out_token) {
    console.log("out");
    console.log(amount_out_token);
    var amount_out_0 = eth_in_wei / amount_out_token[0] / factor;
    var amount_out_1 = eth_in_wei / amount_out_token[1] / factor;
    return { amount_out_0, amount_out_1 };
  } else {
    console.log("Error obtaining router price)");
    return "X";
  }
}

const DisplayRouterPrice = ({ token, router, factory, conn }) => {
  const tokenAddress = token_address[token];
  const [rprice, setRPrice] = React.useState(0);
  React.useEffect(() => {
    RouterPrice(tokenAddress, router, conn).then((rprice) => {
      setRPrice(rprice);
    });
    console.log(rprice);
  }, [token, router, factory]);
  return (
    <div>
      {"PRICE (ROUTER):"} {rprice.amount_out_1} <br />
    </div>
  );
};

const DisplayPrice = ({ token, router, factory, conn }) => {
  const tokenAddress = token_address[token];
  const [price, setPrice] = React.useState(0);
  console.log(price);
  React.useEffect(() => {
    getFTMReservesPrice(tokenAddress, factory, conn).then((price) => {
      setPrice(price);
    });
  }, [token, router, factory]);
  return (
    <div>
      {"RESERVE RATIO:"} {price.reserves_ratio} <br />
      {"PRICE (ADJ RESERVED):"} {price.adjusted_reserves_price} <br />
    </div>
  );
};

export default function App() {
  const [isLit, setLit] = React.useState(false);
  const [token, setToken] = React.useState("LQDR");
  //const [token0_address, setTokenAddress0] = React.useState(token_address[token0]);
  //const [token1_address, setTokenAddress1] = React.useState(token_address[token1]);
  const [dex, setDex] = React.useState("spooky");
  const brightness = isLit ? "lit" : "dark";
  return (
    <div className={`App ${brightness}`}>
      <div align="left">
        Displays token prices, FTM pools only. Color {isLit ? "lit" : "dark"}
        <button onClick={() => setLit(!isLit)}>flip color</button>
        <br /> Token:
        <button onClick={() => setToken("SPA")}>SPA</button>
        <button onClick={() => setToken("DAI")}>DAI</button>
        <button onClick={() => setToken("LQDR")}>LQDR</button>
        <br /> Dex:
        <button onClick={() => setDex("spooky")}>Spooky</button>
        <button onClick={() => setDex("spirit")}>Spirit</button>
        <br />
        <br />
        <DisplayPair token={token} factory={factory_address[dex]} conn={conn} />
        <br />
        <DisplayPrice
          token={token}
          router={router_address[dex]}
          factory={factory_address[dex]}
          conn={conn}
        />
        <br />
        <DisplayRouterPrice
          token={token}
          router={router_address[dex]}
          factory={factory_address[dex]}
          conn={conn}
        />
      </div>
    </div>
  );
}
