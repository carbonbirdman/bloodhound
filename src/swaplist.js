// convenient JSON data structures for arb searches
//const dx = require("./dexes");
//const px = require("./price");
import * as px from "./price.js";
import * as dx from "./dexes.js";

var conn = dx.get_connection();
var eth_in = "1";

function newElement(symbol, flip = false, dexa = "spooky", dexb = "spirit") {
  if (flip) {
    return {
      eth_in: eth_in,
      dex_ask: dexa,
      dex_bid: dexb,
      token0_symbol: "FTM",
      token1_symbol: symbol,
      token0_address: dx.token_address["FTM"],
      token1_address: dx.token_address[symbol],
      conn
    };
  } else {
    return {
      eth_in: eth_in,
      dex_ask: dexb,
      dex_bid: dexa,
      token0_symbol: "FTM",
      token1_symbol: symbol,
      token0_address: dx.token_address["FTM"],
      token1_address: dx.token_address[symbol],
      conn
    };
  }
}

// Create a JSON data structure with a list of tokens and dexes
// each element contains the symbol and addresses of the tokens
// and the dexes to buy and sell at.
function getSwapList(tokens) {
  var swap_list = [];
  for (const element of tokens) {
    swap_list.push(newElement(element));
    swap_list.push(newElement(element, true));
    swap_list.push(newElement(element, false, "spirit", "proto"));
    swap_list.push(newElement(element, true, "spirit", "proto"));
    swap_list.push(newElement(element, false, "spooky", "proto"));
    swap_list.push(newElement(element, true, "spooky", "proto"));
    swap_list.push(newElement(element, false, "spirit", "morph"));
    swap_list.push(newElement(element, true, "spirit", "morph"));
    swap_list.push(newElement(element, false, "spooky", "morph"));
    swap_list.push(newElement(element, true, "spooky", "morph"));
    console.log(element);
  }
  //console.log(swap_requests);
  return swap_list;
}

export { getSwapList };
