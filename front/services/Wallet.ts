import { TezosToolkit } from "@taquito/taquito";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import {
  ColorMode,
  NetworkType,
  TezosOperationType,
  type Network,
} from "@airgap/beacon-sdk";

class Wallet {
  wallet: BeaconWallet | undefined;
  walletAddress: string | undefined;
  tezos: TezosToolkit | undefined;
  network: Network | undefined;
  static instance: Wallet | undefined;

  private constructor() {}

  static async init(): Promise<Wallet> {
    const wallet = new Wallet();
    const rpcUrl = "https://ghostnet.tezos.marigold.dev";
    wallet.network = { type: NetworkType.GHOSTNET, rpcUrl };
    wallet.wallet = new (await import("@taquito/beacon-wallet")).BeaconWallet({
      name: "Hello Tez",
      network: wallet.network,
    });
    wallet.tezos = new TezosToolkit(rpcUrl);
    wallet.tezos.setWalletProvider(wallet.wallet);
    Wallet.instance = wallet;
    return wallet;
  }

  async isConnected(): Promise<boolean> {
    try {
      const activeAccount =
        await Wallet.instance?.wallet?.client.getActiveAccount();
      if (activeAccount) {
        console.log("Got active account:", activeAccount);
        if (Wallet.instance === undefined) {
          throw new Error("Wallet instance is undefined");
        }
        Wallet.instance.walletAddress = activeAccount.address;
        return true;
      }
    } catch (error) {
      console.log("Got error:", error);
    }
    return false;
  }

  getWalletAddress() {
    return Wallet.instance?.walletAddress;
  }

  async sync() {
    try {
      console.log("Requesting permissions...");

      const permissions =
        await Wallet.instance?.wallet?.client.requestPermissions({
          network: Wallet.instance?.network,
        });
      console.log("Got permissions:", permissions?.address);
    } catch (error) {
      console.log("Got error:", error);
    }
  }

  async disconnect() {
    Wallet.instance?.wallet?.client.clearActiveAccount().then(async () => {
      this.walletAddress = undefined;
      const account = await Wallet.instance?.wallet?.client.getActiveAccount();
      console.log("Active Account", account);
    });
  }
}

export const useWallet = async (): Promise<Wallet> => {
  if (Wallet.instance === undefined) {
    const wallet = await Wallet.init();
    return wallet;
  }
  return Wallet.instance;
};
