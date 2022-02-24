const dx = require("../src/dexes");
const px = require("../src/price");
const el = require("../src/elements");
const sl = require("../src/swaplist");

var conn = dx.get_connection();
var eth_in = "1";

console.log("Created connection.");

function cutSwaps(swps) {
  return swps.map((sp) => [sp.token1_symbol, sp.eth_out]);
}

var items = sl.getSwapList(["LQDR", "ETH", "DAI", "SPA", "WBTC"]);

// getSwaps gets the prices on the dexes for this exchange
el.getSwaps(items).then((jarr) => {
  const jc = cutSwaps(jarr);
  console.log(jc);
});
