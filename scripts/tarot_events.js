import { ethers } from "ethers";
import tarotRouterABI from "../src/abi/tarotRouter.json";
var rpc_url = "https://rpc.ftm.tools/";
const conn = new ethers.providers.JsonRpcProvider(rpc_url);
const routerAddress = "0x283e62cfe14b352db8e30a9575481dcbf589ad98";
const routerContract = new ethers.Contract(routerAddress, tarotRouterABI, conn);

async function main() {
  console.log("listening");
  routerContract.on(
    "mintCollateral",
    (poolToken, amount, to, deadline, permitData) => {
      console.log("Swap detected sender", to);
      var return_object = {
        poolToken,
        amount,
        to,
        deadline,
        permitData
      };
      console.log(return_object);
    }
  );
  //contract.queryFilter( event [ , fromBlockOrBlockHash [ , toBlock ] )
}

main();
