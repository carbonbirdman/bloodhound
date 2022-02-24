//Returns bid price, ask price.
//Bid price is how much they will give you in fantom for the token.
//Ask price is how much fantom you need to give for the token.

import { ethers } from "ethers";
import * as dx from "./dexes.js";

const tokenABI = require("./abi/token.json");
const factoryABI = require("./abi/factory.json");
const routerABI = require("./abi/router.json");
const pairABI = require("./abi/pairs.json");
let token_address = {
  FTM: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  LQDR: "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9",
  ETH: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  DAI: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
  SPA: "0x5602df4a94eb6c680190accfa2a475621e0ddbdc",
  WBTC: "0x321162Cd933E2Be498Cd2267a90534A804051b11"
};
const weth_decimal = 18;
const weth_address = ethers.utils.getAddress(token_address["FTM"]);
const verbose = false;

async function getAskPrice(eth_in, pair_address, factory, router, conn) {
  // eth_in: input amount of tokens, ether or platform coin
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  var ask_price_ftm = "none";
  try {
    const token0_address = await pair_contract.token0();
    const token1_address = await pair_contract.token1();
    //console.log(token0_address, token1_address, weth_address);

    if (token0_address == weth_address) {
      //console.log("eth first");
      var token_address = token1_address;
    } else if (token1_address == weth_address) {
      //console.log("eth second");
      var token_address = token0_address;
    } else {
      return "Error matching eth equivalent";
    }

    const token_contract = new ethers.Contract(token_address, tokenABI, conn);
    const token_decimal = await token_contract.decimals();
    const eth_in_wei = ethers.utils.parseUnits(eth_in);
    const factor = Math.pow(10, weth_decimal) / Math.pow(10, token_decimal);

    const router_contract = new ethers.Contract(router, routerABI, conn);

    const amount_out_token = await router_contract.getAmountsOut(eth_in_wei, [
      weth_address,
      token_address
    ]);

    const ask_price_wei = eth_in_wei / amount_out_token[1];
    ask_price_ftm = ask_price_wei / factor;
    const adjusted_token_out =
      amount_out_token[1] * Math.pow(10, -token_decimal);
    if (verbose) {
      console.log(
        "getprice: %f FTM gets you %f tokens",
        eth_in,
        adjusted_token_out
      );
    }
    //return(ask_price_wei, ask_price_ftm)
    return {
      ask_price_ftm: ask_price_ftm,
      token_out: adjusted_token_out,
      eth_in: eth_in
    };
  } catch (err) {
    console.log(err);
    console.log("Error");
    return "error";
  }
}

async function getBidPrice(token_in, pair_address, factory, router, conn) {
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  var bid_price_ftm = "none";
  //const pair_decimals = await pair_contract.decimals();
  // check which token is the platform coin which is
  // what we're trading in. A more sophisticated version of this would
  // work for any pair of coins.
  //reserve_tokengwei = weth_amnt.toBigInt().toString(),
  try {
    const token0_address = await pair_contract.token0();
    const token1_address = await pair_contract.token1();
    //console.log(token0_address, token1_address, weth_address);

    if (token0_address == weth_address) {
      //console.log("eth first");
      var token_address = token1_address;
    } else if (token1_address == weth_address) {
      //console.log("eth second");
      var token_address = token0_address;
    } else {
      return "Error matching eth equivalent";
    }

    const token_contract = new ethers.Contract(token_address, tokenABI, conn);
    const token_decimal = await token_contract.decimals();
    const factor = Math.pow(10, weth_decimal) / Math.pow(10, token_decimal);

    const router_contract = new ethers.Contract(router, routerABI, conn);
    // don't do this
    //const tokens_in_wei = token_in * Math.pow(10, token_decimal);
    // do this
    const tokens_in_wei = ethers.utils.parseUnits(token_in, token_decimal);
    var amount_out = await router_contract.getAmountsOut(tokens_in_wei, [
      token_address,
      weth_address
    ]);
    const bid_price_wei = amount_out[1] / tokens_in_wei;
    const adjusted_ftm_out = amount_out[1] * Math.pow(10, -weth_decimal);
    // price is in the input units
    bid_price_ftm = bid_price_wei / factor;
    if (verbose) {
      console.log(
        "getprice: %f tokens gets you %f FTM",
        token_in,
        adjusted_ftm_out
      );
    }
    return {
      bid_price_ftm: bid_price_ftm,
      token_in: token_in,
      eth_out: adjusted_ftm_out
    };
  } catch (err) {
    console.log(err);
    console.log("Error");
    return "error";
  }
}

async function getAskBidPrice(eth_in, pair_address, factory, router, conn) {
  // eth_in: input amount of tokens, ether or platform coin
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  var ask_price_ftm = "none";
  var bid_price_ftm = "none";
  //const pair_decimals = await pair_contract.decimals();
  // check which token is the platform coin which is
  // what we're trading in. A more sophisticated version of this would
  // work for any pair of coins.
  //reserve_tokengwei = weth_amnt.toBigInt().toString(),
  try {
    const token0_address = await pair_contract.token0();
    const token1_address = await pair_contract.token1();
    console.log(token0_address, token1_address, weth_address);

    if (token0_address == weth_address) {
      console.log("eth first");
      var token_address = token1_address;
    } else if (token1_address == weth_address) {
      console.log("eth second");
      var token_address = token0_address;
    } else {
      return "Error matching eth equivalent";
    }

    const token_contract = new ethers.Contract(token_address, tokenABI, conn);
    const token_decimal = await token_contract.decimals();
    const eth_in_wei = ethers.utils.parseUnits(eth_in);
    const factor = Math.pow(10, weth_decimal) / Math.pow(10, token_decimal);

    const router_contract = new ethers.Contract(router, routerABI, conn);

    // First call: for a given token0 input, find how much token1 we get out
    const amount_out_token = await router_contract.getAmountsOut(eth_in_wei, [
      weth_address,
      token_address
    ]);

    const ask_price_wei = eth_in_wei / amount_out_token[1];
    ask_price_ftm = ask_price_wei / factor;
    const adjusted_token_out =
      amount_out_token[1] * Math.pow(10, -token_decimal);
    // Second call: selling this amount of eth back, how much token do we get?
    const tokens_in = amount_out_token[1];
    var amount_out_ftm = await router_contract.getAmountsOut(tokens_in, [
      token_address,
      weth_address
    ]);
    const bid_price_wei = amount_out_ftm[1] / tokens_in;
    const adjusted_ftm_out = amount_out_ftm[1] * Math.pow(10, -weth_decimal);
    // price is in the input units
    bid_price_ftm = bid_price_wei / factor;
    if (verbose) {
      console.log(
        "getprice: %f FTM gets you %f tokens",
        eth_in,
        adjusted_token_out
      );
      console.log(
        "getprice: %f tokens gets you %f FTM",
        eth_in,
        adjusted_ftm_out
      );
    }
  } catch (err) {
    console.log(err);
    console.log("Error");
    return "error";
  }
  //return(bid_price_wei, ask_price_wei, ask_price_ftm, bid_price_ftm)
  return { ask_price_ftm: ask_price_ftm, bid_price_ftm: bid_price_ftm };
}

export { getAskPrice, getBidPrice, getAskBidPrice };
