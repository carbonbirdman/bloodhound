import { ethers } from "ethers";

import fs from "fs";
const tokenABI = JSON.parse(fs.readFileSync("./src/abi/token.json", "utf8"));
//import tokenABI from "./abi/token.json";

var ftm_main_url = "https://rpc.ftm.tools/";

function get_connection() {
  const provider = new ethers.providers.JsonRpcProvider(ftm_main_url);
  return provider;
}

//exports.token_address = token_address;
//module.exports = {
//  get_connection: get_connection
//};
