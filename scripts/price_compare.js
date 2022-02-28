// Demonstrates how to do price comparison on an array of settings

const dx = require("../src/dexes");
const px = require("../src/price");
const el = require("../src/elements");

var conn = dx.get_connection();
var eth_in = "1";

//this is a linked list
//swap_requests.push(new_price);
// it has numeric indices Object.keys(swap_requests)
let swap_requests = [
  {
    eth_in: eth_in,
    dex_ask: "spirit",
    dex_bid: "spooky",
    token0_symbol: "FTM",
    token1_symbol: "WBTC",
    token0_address: dx.token_address["FTM"],
    token1_address: dx.token_address["WBTC"],
    conn
  },
  {
    eth_in: eth_in,
    dex_ask: "spirit",
    dex_bid: "spooky",
    token0_symbol: "FTM",
    token1_symbol: "ETH",
    token0_address: dx.token_address["FTM"],
    token1_address: dx.token_address["ETH"],
    conn
  }
];

function cutSwaps(swps) {
  return swps.map((sp) => [sp.token1_symbol, sp.eth_out]);
}

var items = el.getSwapList(["LQDR", "ETH", "DAI", "SPA", "WBTC"]);

el.getSwaps(items).then((jarr) => {
  const jc = cutSwaps(jarr);
  console.log(jc);
});

var items = el.getSwapList([
  "LQDR",
  "ETH",
  "DAI",
  "SPA",
  "WBTC",
  "ICE",
  "MIM",
  "CRV",
  "LINK",
  "SUSHI",
  "BIFI",
  "MIM",
  "ANY"
]);
console.log(items);

//console.log(Object.keys(swap_requests));
//getAllSwapPrices(swap_requests).then((jarr) => console.log(jarr));
