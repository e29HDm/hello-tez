import { NetworkType } from "@airgap/beacon-sdk";

export const useSettings = () => {
  return {
    appName: "Hello Tez",
    endpoint: "https://ghostnet.tezos.marigold.dev",
    network: NetworkType.GHOSTNET,
    contract: "KT1QtDGAu4gTgr4DfJGAzrwrn6txXFuXJ2Ha",
  };
};
