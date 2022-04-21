import { PublicKey } from '@solana/web3.js';

export const DEFAULTS = {
  BREED_PROG_ID: new PublicKey(
    '39JMEP5Ss4uEXJfqiJdL6M2nrwPfJ9W632iR2h1hZUnf'
  ),
  CUSTOM_MINT: new PublicKey(
    '262Nk6611gereoNCt1cdgbKgxFfzLVHMFD3ddQ3Hd3QZ'
  ),
  MTM_MINT: new PublicKey(
    '3xNEV21PVX1xP7o8TCieAJs7XTWwBDDBmbnW4epZxzW9'
  ),
  CANDY_MACHINE_ID: new PublicKey(
    'AXFjnx6hTVvfXeAgqwKrbaZ1Sk735q58g3bXZ4uzsmmi'
  ),
  RPC_HOST: 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/',
  // to change to 604800 during production
  MIN_COOLDOWN: 60,
  // to change during production
  MTM_AMOUNT: 200,
};
