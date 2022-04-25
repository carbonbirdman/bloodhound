// FIRST USE GRPAH TO LOOK AT POOLS

import { request, gql } from "graphql-request";

const BALANCERS = gql`
  query {
    balancers(first: 5, orderBy: totalSwapVolume, orderDirection: desc) {
      id
      totalSwapVolume
    }
  }
`;

const POOLS = gql`
  query {
    pools(first: 5, orderBy: "totalSwapVolume", orderDirection: desc) {
      id
      totalSwapVolume
      tokens {
        symbol
        address
        balance
      }
    }
  }
`;

query {
  pools(first: 5, orderBy: totalSwapVolume, orderDirection: desc) {
    id
    totalSwapVolume
        symbol
  tokens{
    symbol

  }  
  }

}

// FIRST USE APOLLO TO LOOK AT POOLS

import { request, gql } from "graphql-request";

const QUERY_BAL = gql`
  query {
    balancers(first: 5, orderBy: "totalSwapVolume", orderDirection: desc) {
      id
      totalSwapVolume
      pools {
        symbol
        address
        balance
      }
    }
  }
`;

console.log(QUERY_BAL);

request(
  "https://graph-node.beets-ftm-node.com/subgraphs/name/beethovenx",
  POOLS
).then((data) => console.log(data));

//const beetAddress = "0xDb8B0449FE89cF8251c9029827fDA3f11Ed7150e";
//const tarotBorrowableABI = require("../src/tarotBorrowable.json");
//const tarotBorrowableContract = new ethers.Contract(
//  tarotBorrowableAddress,
//  tarotBorrowableABI,
//  conn
//);

