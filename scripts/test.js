import * as dx from "../src/dexes.js";
import * as px from "../src/price.js";
import * as sl from "../src/swaplist.js";
import * as el from "../src/elements.js";
import * as lib from "../src/library.js";

var conn = dx.get_connection();
var eth_in = "1";

console.log(dx.tokenABI);

console.log("Created connection.");

function cutSwaps(swps) {
  return swps.map((sp) => [sp.token1_symbol, sp.eth_out]);
}

var items = sl.getSwapList(["LQDR", "ETH", "DAI", "SPA", "WBTC"]);

const swap_request = {
  eth_in: eth_in,
  dex_ask: "spirit",
  dex_bid: "spooky",
  token0_symbol: "FTM",
  token1_symbol: "LQDR",
  token0_address: dx.token_address["FTM"],
  token1_address: dx.token_address["LQDR"],
  conn
};
el.getSwapPrice(swap_request).then((swapout) => console.log(swapout));

// getSwaps gets the prices on the dexes for this exchange
//el.getSwaps(items).then((jarr) => {
// const jc = cutSwaps(jarr);
//  console.log(jc);
//});
