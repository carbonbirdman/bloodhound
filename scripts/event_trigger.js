const ethers = require("ethers");

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

var rpc_url = "https://rpc.ftm.tools/";
const conn = new ethers.providers.JsonRpcProvider(rpc_url);
let token0_address = token_address["LQDR"];
let token1_address = token_address["FTM"];

async function main() {
  const pairABI = require("../src/abi/pairs.json");
  const factoryABI = require("../src/abi/factory.json");
  const factory_contract = new ethers.Contract(
    factory_address["spooky"],
    factoryABI,
    conn
  );

  const pair_address = await factory_contract.getPair(
    token0_address,
    token1_address
  );

  const pair_contract = new ethers.Contract(pair_address, pairABI, conn);

  pair_contract.on(
    "Swap",
    async (sender, amount0In, amount1In, amount0Out, amount1Out, address) => {
      console.log(`
    Swap detected
    =================
    ${sender}
  `);
    }
  );
}

main();
