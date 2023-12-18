<script setup lang="ts">
import { useWallet } from "../services/Wallet";

const wallet = await useWallet();
const isConnected = ref(false);
const walletAddress: Ref<string | undefined> = ref("");
const profileBtnIsOpen = ref(false);
const profileBtn = ref<HTMLElement>();
const app = ref<HTMLElement>();

const syncWallet = async () => {
  await wallet.sync();
  await connectionStatus();
};

const connectionStatus = async () => {
  isConnected.value = await wallet.isConnected();
  if (isConnected.value) {
    walletAddress.value = wallet.getWalletAddress();
  }
};

const disconnect = async () => {
  await wallet.disconnect();
  connectionStatus();
  profileBtnIsOpen.value = false;
};

const truncatedWalletAddress = computed(() => {
  if (walletAddress.value) {
    return (
      walletAddress.value.substring(0, 5) +
      "..." +
      walletAddress.value.substring(walletAddress.value.length - 5)
    );
  }
});

onMounted(async () => {
  connectionStatus();
  // listen click outside of profile button
  if (app.value && profileBtn.value) {
    app.value.addEventListener("click", (event) => {
      if (
        profileBtn.value &&
        !profileBtn.value.contains(event.target as Node)
      ) {
        profileBtnIsOpen.value = false;
      }
    });
  }
});
</script>

<template>
  <div ref="app" class="min-h-screen bg-black text-white">
    <nav class="container mx-auto px-4 flex h-20 justify-between">
      <div class="flex items-center">
        <nuxt-link to="/" class="text-2xl font-bold font-mono"
          >Hello Tez</nuxt-link
        >
      </div>
      <div class="flex items-center">
        <nuxt-link to="/about" class="mr-4">About</nuxt-link>
        <button
          class="bg-gray-300/50 backdrop-blur-md hover:bg-gray-300/60 transition px-4 py-2 rounded-lg border-gray-300 border-2 flex items-center text-base"
          v-if="!isConnected"
          @click="syncWallet"
        >
          Sync
        </button>
        <div v-show="isConnected" class="relative" ref="profileBtn">
          <button
            class="bg-gray-300/50 backdrop-blur-md hover:bg-gray-300/60 transition px-3 py-1 rounded-lg border-gray-300 border-2 flex items-center text-base"
            @click="profileBtnIsOpen = !profileBtnIsOpen"
          >
            {{ truncatedWalletAddress }}
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-green-400"
              ></span>
            </span>
          </button>
          <ul
            class="absolute rounded-lg border-gray-300 border-2 flex flex-col w-full mt-2 z-20 text-base divide-y-2 divide-gray-300 overflow-clip"
            v-show="profileBtnIsOpen"
          >
            <li class="flex">
              <button
                class="py-2 pl-3 bg-gray-300/50 backdrop-blur-md hover:bg-gray-300/60 transition w-full text-left"
                @click="disconnect"
              >
                Unsync
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>
