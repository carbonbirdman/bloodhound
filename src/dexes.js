import { ethers } from "ethers";
import fs from "fs";
import tokenABI from "./abi/token.json";
import factoryABI from "./abi/factory.json";
import routerABI from "./abi/router.json";
import pairABI from "./abi/pairs.json";
//import { createRequire } from 'module';

//REQUIRE METHOD
//const require = createRequire(import.meta.url);
//const tokenABI = require("./abi/token.json");
//const factoryABI = require("./abi/factory.json");
//const routerABI = require("./abi/router.json");
//const pairABI = require("./abi/pairs.json");

// FILE READ METHOD
//const tokenABI = JSON.parse(fs.readFileSync("./src/abi/token.json"));
//const tokenABI = fs.readFileSync("./src/abi/token.json");
//var parsed= JSON.parse(fs.readFileSync(jsonFile));
//const factoryABI = JSON.parse(
//  fs.readFileSync("./src/abi/factory.json", "utf8")
//);
//const routerABI = JSON.parse(fs.readFileSync("./src/abi/router.json", "utf8"));
//const pairABI = JSON.parse(fs.readFileSync("./src/abi/pairs.json", "utf8"));

var ftm_main_url = "https://rpc.ftm.tools/";

let factory_address = {
  spooky: "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3",
  spirit: "0x991152411A7B5A14A8CF0cDDE8439435328070dF",
  proto: "0x39720E5Fe53BEEeb9De4759cb91d8E7d42c17b76",
  morph: "0x9C454510848906FDDc846607E4baa27Ca999FBB6"
};

let router_address = {
  spooky: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  spirit: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
  proto: "0xF4C587a0972Ac2039BFF67Bc44574bB403eF5235",
  morph: "0x8aC868293D97761A1fED6d4A01E9FF17C5594Aa3"
};

let token_address = {
  FTM: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  LQDR: "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9",
  ETH: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  DAI: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
  SPA: "0x5602df4a94eb6c680190accfa2a475621e0ddbdc",
  WBTC: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
  CRV: "0x1E4F97b9f9F913c46F1632781732927B9019C68b",
  LINK: "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
  SUSHI: "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC",
  ICE: "0xf16e81dce15B08F326220742020379B855B87DF9",
  ANY: "0xdDcb3fFD12750B45d32E084887fdf1aABAb34239",
  BIFI: "0xd6070ae98b8069de6B494332d1A1a81B6179D960",
  MIM: "0x82f0B8B456c1A451378467398982d4834b6829c1"
};

const weth_address = ethers.utils.getAddress(token_address["FTM"]);
const weth_decimal = 18;

function get_connection() {
  const provider = new ethers.providers.JsonRpcProvider(ftm_main_url);
  return provider;
}

async function getPair(token0_address, token1_address, factory, conn) {
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  const pair_address = await factory_contract.getPair(
    token0_address,
    token1_address
  );
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  if (pair_contract) {
    return { contract: pair_contract, address: pair_address };
  } else {
    console.log("Error obtaining pair contract");
    return { contract: "None", address: "None" };
  }
}

async function getFTMReservesPrice(token_address, factory, conn) {
  const token_contract = new ethers.Contract(token_address, tokenABI, conn);
  const token_decimal = await token_contract.decimals();
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  const reserves = false;
  const pair_address = await factory_contract.getPair(
    token_address,
    weth_address
  );
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  const token0_address = pair_contract.token0();
  const token1_address = pair_contract.token1();
  try {
    reserves = await pair_contract.getReserves();
  } catch (err) {
    console.log("Error obtaining reserves");
  }
  if (reserves) {
    // check if ftm is first or second
    if (token0_address == weth_address) {
      console.log("eth first");
      var token_amnt = reserves[0];
      var weth_amnt = reserves[1];
    } else if (token1_address == weth_address) {
      var token_amnt = reserves[1];
      var weth_amnt = reserves[0];
    } else {
      return "Error matching eth equivalent";
    }
    var reserves_price = weth_amnt / token_amnt;
    const factor = Math.pow(10, weth_decimal) / Math.pow(10, token_decimal);
    var adjusted_reserves_price = reserves_price / factor;
    console.log(reserves);
    console.log(reserves[0]);
    console.log(factor);
    return adjusted_reserves_price;
  } else {
    console.log("Error obtaining reserves (ftm pair)");
    return "X";
  }
}

async function getReservesPrice(token0_address, token1_address, factory, conn) {
  const token0_contract = new ethers.Contract(token0_address, tokenABI, conn);
  const token1_contract = new ethers.Contract(token1_address, tokenABI, conn);
  var reserves = false;
  console.log(token0_contract);
  // first check is one token FTM? if so, call ftm function
  //if (token0_address == weth_address) {
  //  reserves = getFTMReservesPrice(token0_address, factory, conn);
  //  return reserves;
  //} else if (token1_address == weth_address) {
  //  reserves = getFTMReservesPrice(token1_address, factory, conn);
  //  return reserves;
  //} else {
  const token0_decimal = await token0_contract.decimals();
  const token1_decimal = await token1_contract.decimals();
  const factor = Math.pow(10, token0_decimal) / Math.pow(10, token1_decimal);
  console.log(token1_decimal);
  console.log(token0_decimal);
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  const pair_address = await factory_contract.getPair(
    token0_address,
    token1_address
  );
  console.log(pair_address);
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  console.log(pair_contract);
  try {
    reserves = await pair_contract.getReserves();
  } catch (err) {
    //return reserves;
  }
  if (reserves) {
    console.log(reserves);
    console.log(reserves[0]);
    //console.log(reserves._reserves0);
    const reserves_price = reserves[0] / reserves[1] / factor;
    return reserves_price;
  } else {
    console.log("Error obtaining reserves");
    return "X";
  }
  //}
}

async function getReserves(token0_address, token1_address, factory, conn) {
  const token0_contract = new ethers.Contract(token0_address, tokenABI, conn);
  const token1_contract = new ethers.Contract(token1_address, tokenABI, conn);
  var reserves = false;
  console.log(token0_contract);

  const token0_decimal = await token0_contract.decimals();
  const token1_decimal = await token1_contract.decimals();
  const factor = Math.pow(10, token0_decimal) / Math.pow(10, token1_decimal);
  console.log(token1_decimal);
  console.log(token0_decimal);
  const factory_contract = new ethers.Contract(factory, factoryABI, conn);
  const pair_address = await factory_contract.getPair(
    token0_address,
    token1_address
  );
  console.log(pair_address);
  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);
  console.log(pair_contract);
  try {
    reserves = await pair_contract.getReserves();
  } catch (err) {
    //return reserves;
  }
  if (reserves) {
    console.log("Reserves");
    console.log(reserves);
    console.log(reserves[0]);
    const reserves_price = reserves[0] / reserves[1] / factor;
    var reserves0 = reserves[0];
    var reserves1 = reserves[1];
    var reserveout = { reserves0, reserves1, reserves_price };
    return reserveout;
  } else {
    console.log("Error obtaining reserves");
    return "X";
  }
}

async function test_dex() {
  var conn = get_connection();
  var dex = "spooky";
  const token0_address = token_address["FTM"];
  const token1_address = token_address["DAI"];
  const router = router_address[dex];
  const factory = factory_address[dex];
  getReservesPrice(token0_address, token1_address, factory, conn);
}

export {
  getReservesPrice,
  getFTMReservesPrice,
  factory_address,
  token_address,
  router_address,
  weth_address,
  weth_decimal,
  get_connection,
  getPair,
  tokenABI,
  pairABI,
  factoryABI,
  routerABI
};
