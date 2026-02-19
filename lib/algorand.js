import algosdk from "algosdk";

// Connect to TestNet API
export const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

export async function getParams() {
  return await algodClient.getTransactionParams().do();
}