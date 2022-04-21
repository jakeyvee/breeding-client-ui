import * as anchor from '@project-serum/anchor';
import { BN, Idl } from '@project-serum/anchor';
import { BreedClient } from './breed-client';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DEFAULTS } from './globals';
import { NodeWallet, programs } from '@metaplex/js';

//when we only want to view claimed or mount data, no need to connect a real wallet.
function createFakeWallet() {
  const leakedKp = Keypair.fromSecretKey(
    Uint8Array.from([
      208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242,
      120, 4, 78, 75, 19, 227, 13, 215, 184, 108, 226, 53, 111, 149, 179, 84,
      137, 121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242, 57, 158,
      226, 207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249, 157, 62, 80,
    ])
  );
  return new NodeWallet(leakedKp);
}

//need a separate func coz fetching IDL is async and can't be done in constructor
export async function initBreed(
  conn: Connection,
  wallet?: anchor.Wallet
) {
  const walletToUse = wallet ?? createFakeWallet();
  const idl = await (await fetch('mount_breed.json')).json();
  return new Breed(conn, walletToUse as anchor.Wallet, idl);
}

export class Breed extends BreedClient {
  constructor(conn: Connection, wallet: anchor.Wallet, idl: Idl) {
    const programId = DEFAULTS.BREED_PROG_ID;
    super(conn, wallet, idl, programId);
  }
}
