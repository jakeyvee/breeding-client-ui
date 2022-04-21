import * as anchor from "@project-serum/anchor";
import { AccountInfo, ParsedAccountData, PublicKey, TokenAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { programs } from "@metaplex/js";
import { MountInfoInt, MtmInfoInt } from "../Breed";
import {DEFAULTS} from "./globals"

const filterMountAccounts = async (
  accountInfoList: { 
    account: AccountInfo<ParsedAccountData>; 
    pubkey: PublicKey 
  }[], 
  connection: anchor.web3.Connection
) : Promise<MountInfoInt[]> => {
  const windowOrigin = window.location.origin;
  // const mountMounts = await (
  //   await fetch(windowOrigin + "/info/mints_list.json")
  // ).json();
  const responses = await Promise.all(
    accountInfoList.map(row => connection.getTokenAccountBalance(row.pubkey, "confirmed"))
  );
  // remove token account filter for prod
  return accountInfoList.filter(
    (account, i) =>
      (responses[i].value.uiAmount === 1 && responses[i].value.decimals === 0)
      && account.pubkey.toBase58() !== "DGMjynfyGWB6FANowJS9KzrufNohJXp3PMGYjeUv8wLh"
  ).map(mountAccount => {
    return {
      mint: new PublicKey(mountAccount.account.data.parsed.info.mint),
      token: mountAccount.pubkey,
      imageUrl: "loading",
      name: "loading"
    }
  })
}

const filterMtmAccount = async (
  gemAccounts: {
    account: AccountInfo<ParsedAccountData>;
    pubkey: PublicKey;
  }[], 
  connection: anchor.web3.Connection
): Promise<MtmInfoInt> => {
  const mtmAccount = gemAccounts.filter(
    account => account.account.data.parsed.info.mint === DEFAULTS.MTM_MINT.toBase58()
  ).slice(0)
  if (mtmAccount.length === 0) {
    const fakeAccount = anchor.web3.Keypair.generate();
    return {
      mint: DEFAULTS.MTM_MINT,
      token: fakeAccount.publicKey,
      amount: 0
    }
  } else {
    const response = await connection.getTokenAccountBalance(mtmAccount[0].pubkey, "confirmed")
    return {
      mint: mtmAccount[0].account.data.parsed.info.mint,
      token: mtmAccount[0].pubkey,
      amount: response.value.uiAmount!
    }
  }
}

export const getMountsAndMtm = async (connection: anchor.web3.Connection, pubkey: PublicKey): Promise<[MountInfoInt[], MtmInfoInt]> => {
  let tokenAccountsFilter: TokenAccountsFilter = {
    programId: TOKEN_PROGRAM_ID
  }
  const splTokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, tokenAccountsFilter);
  const mountAccounts = await filterMountAccounts(splTokenAccounts.value, connection)
  const mtmAccount = await filterMtmAccount(splTokenAccounts.value, connection)
  return [mountAccounts, mtmAccount]
}

function api(url: string): Promise<string> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<{ image: string }>
    }, () => {return {image: ""}})
    .then(data => {
      return data.image
    })
}

export const getMountInfo = async (
  mountAccount : MountInfoInt,
  connection: anchor.web3.Connection
) : Promise<MountInfoInt> => {
  const tokenMetaPubKey: PublicKey = await programs.metadata.Metadata.getPDA(mountAccount.mint);
  const tokenMeta = await programs.metadata.Metadata.load(connection, tokenMetaPubKey);
  const resp: string = await api(tokenMeta.data.data.uri)
  return {
    token: mountAccount.token,
    mint: mountAccount.mint,
    imageUrl: resp,
    name: tokenMeta.data.data.name
  }
}