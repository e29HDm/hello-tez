<script setup lang="ts">
import { useWallet } from "../services/Wallet";

const wallet = await useWallet();
wallet.tezos?.contract
  .at("KT1QtDGAu4gTgr4DfJGAzrwrn6txXFuXJ2Ha")
  .then((c) => {
    let methods = c.parameterSchema.ExtractSignatures();
    console.log(JSON.stringify(methods, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
</script>

<template>
  <div>Hello</div>
</template>
