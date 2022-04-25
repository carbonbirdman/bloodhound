// Test hypothesis - large trades affect pool
// reserves creating arb opportunity

import {
  factoryABI,
  pairABI,
  router_address,
  routerABI,
  tokenABI,
  token_address
} from "./ftmx";
import React from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

export const DisplayEvent = ({ pairAddress }) => {
  const {
    chainId,
    active,
    account,
    connector,
    activate,
    library,
    provider
  } = useWeb3React();

  const [event, setEvent] = React.useState({
    sender: "None",
    amount0In: "None",
    amount1In: "None",
    amount0Out: "None",
    amount1Out: "None",
    address: "None"
  });

  async function getContract() {
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const signer = await provider.getSigner();
    const pairContract = new ethers.Contract(
      pairAddress,
      pairABI,
      library.getSigner()
    );
    return pairContract;
  }

  React.useEffect(() => {
    // listen for changes on an Ethereum address
    console.log(`listening...`);

    if (active) {
      console.log(`active...`);
      getContract().then((pairContract) => {
        pairContract.on(
          "Swap",
          (sender, amount0In, amount1In, amount0Out, amount1Out, address) => {
            console.log("Swap detected sender", sender);
            var return_object = {
              sender,
              amount0In,
              amount1In,
              amount0Out,
              amount1Out,
              address
            };
            console.log(return_object);
            setEvent(return_object);
            return return_object;
          }
        );
        // remove listener when the component is unmounted
        return () => {
          pairContract.removeAllListeners("Swap");
        };
      });
    }

    // trigger the effect only on component mount
  }, []);
  if (event.sender === "None") {
    return <div> ... Listening to {pairAddress}...</div>;
  }
  return (
    <div>
      {" "}
      {"Event detected"} <br />
      {"FTM in: "}
      {parseFloat(ethers.utils.formatEther(event.amount0In)).toPrecision(4)}
      <br />
      {"DAI out: "}
      {parseFloat(ethers.utils.formatEther(event.amount1Out)).toPrecision(
        4
      )}{" "}
      <br />
      {"Sender:"}
      {event.sender}
    </div>
  );
};
