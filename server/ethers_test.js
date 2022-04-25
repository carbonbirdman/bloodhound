import ethers from "ethers";
import * as dx from "../src/dexes.js";
const provider_url =
  "https://apis.ankr.com/300a0d7f15fc4a01b79ff1bd778088d7/45614406b1e8e84a919cc03be771db24/fantom/full/main";
var ftm_main_url = "https://rpc.ftm.tools/";

function get_connection() {
  const provider = new ethers.providers.JsonRpcProvider(ftm_main_url);
  //const provider = new ethers.providers.JsonRpcProvider(provider_url);
  return provider;
}

const wallet = ethers.utils.getAddress(
  "0xC6F22Bd725FD986FcacD7bFeaf94fDAE2D1E3Bc4"
);
const tokenContractAddress = ethers.utils.getAddress(
  "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
);

async function main() {
  console.log("Start function");
  console.log(wallet);

  const provider = get_connection();

  const contract = new ethers.Contract(
    tokenContractAddress,
    dx.tokenABI,
    provider
  );
  console.log("Contract created.");

  const balance = (await contract.balanceOf(wallet)).toString();
  console.log(ethers.utils.formatEther(balance));
}

main();
