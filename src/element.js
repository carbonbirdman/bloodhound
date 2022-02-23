// Data and objects for display on page
const dx = require("./dexes");
const px = require("./price");
var conn = dx.get_connection();
var eth_in = "1";

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

// ASK
async function getSwapPrice(pq) {
  try {
    const ask_factory = dx.factory_address[pq.dex_ask];
    const ask_router = dx.router_address[pq.dex_ask];
    var ask_pair = await dx.getPair(
      pq.token0_address,
      pq.token1_address,
      ask_factory,
      pq.conn
    );
    var ask = await px.getAskPrice(
      pq.eth_in,
      ask_pair.address,
      ask_factory,
      ask_router,
      pq.conn
    );
    //console.log(ask);

    // BID
    const bid_factory = dx.factory_address[pq.dex_bid];
    const bid_router = dx.router_address[pq.dex_bid];
    var bid_pair = await dx.getPair(
      pq.token0_address,
      pq.token1_address,
      bid_factory,
      pq.conn
    );
    var bid = await px.getBidPrice(
      ask.token_out.toString(),
      bid_pair.address,
      bid_factory,
      bid_router,
      pq.conn
    );
    //console.log(bid);
    const PRECISION = 2;
    const FIXED = 4;
    // do the maths on the calculation

    return {
      token0_symbol: pq.token0_symbol,
      token1_symbol: pq.token1_symbol,
      ask_price: ask.ask_price_ftm, //.toFixed(FIXED),
      bid_price: bid.bid_price_ftm, //.toFixed(FIXED),
      token_out: ask.token_out, //.toFixed(FIXED),
      eth_in: ask.eth_in,
      token_in: bid.token_in, //.toPrecision(PRECISION),
      eth_out: bid.eth_out, //.toFixed(FIXED),
      dex_ask: pq.dex_ask,
      dex_bid: pq.dex_bid
    };
  } catch (err) {
    console.log("Error ", pq.ask_dex, pq.bid_dex);
    console.log(err);
    return {
      token0_symbol: pq.token0_symbol,
      token1_symbol: pq.token1_symbol,
      ask_price: "NA",
      bid_price: "NA",
      token_out: "NA",
      eth_in: "NA",
      token_in: "NA",
      eth_out: "NA",
      dex_ask: pq.dex_ask,
      dex_bid: pq.dex_bid
    };
  }
}

// getting the price and formatting the price should be different functions
// and separated

async function getPriceDumb() {
  return 10.0;
}

async function getSwaps(sreqs) {
  return await Promise.all(sreqs.map(async (sreq) => await getSwapPrice(sreq)));
}

module.exports = {
  getSwapPrice: getSwapPrice,
  getPriceDumb: getPriceDumb,
  getSwaps: getSwaps,
  swap_requests: swap_requests,
  getSwapList: getSwapList
};
