import * as anchor from '@project-serum/anchor';
import { BN, Idl, Program, Provider, Wallet } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import {
  AccountInfo,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { programs } from '@metaplex/js';
import { AccountUtils } from './account-utils';
import { MountBreed } from './mount_breed';
import { isKp } from './types';
import { DEFAULTS } from './globals';
import { createAssociatedTokenAccountInstruction } from './utils';
import { getCandyMachineState, mintOneTokenMatrix } from './candy-machine';
import { sendTransactions, SequenceType } from '../connection';

export class BreedClient extends AccountUtils {
  wallet: anchor.Wallet;
  provider!: anchor.Provider;
  breedProgram!: anchor.Program<MountBreed>;

  constructor(
    conn: Connection,
    wallet: Wallet,
    idl: Idl,
    programId: PublicKey
  ) {
    super(conn);
    this.wallet = wallet;
    this.setProvider();
    this.setBreedProgram(idl, programId);
  }

  setProvider() {
    this.provider = new Provider(
      this.conn,
      this.wallet,
      Provider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setBreedProgram(idl: Idl, programId: PublicKey) {
    //instantiating program depends on the environment
    //means running in prod
    this.breedProgram = new anchor.Program<MountBreed>(
      idl as any,
      programId,
      this.provider
    );
  }

  setWallet(wallet: anchor.Wallet) {
    this.wallet = wallet
  }

  // --------------------------------------- fetch deserialized accounts

  async fetchMountPDA(mountPDAKey: PublicKey) {
    return this.breedProgram.account.data.fetch(mountPDAKey);
  }

  // --------------------------------------- find PDA addresses

  async findVaultPDA() {
    return this.findProgramAddress(this.breedProgram.programId, [
      'token-seed'
    ]);
  }

  async findVaultAuthoriyPDA() {
    return this.findProgramAddress(this.breedProgram.programId, [
      'authority-seed'
    ]);
  }

  async findEscrowPDA() {
    return this.findProgramAddress(this.breedProgram.programId, [
      'escrow-seed'
    ]);
  }

  async findMountPDA(mountMintAccount: PublicKey) {
    return this.findProgramAddress(this.breedProgram.programId, [
      mountMintAccount
    ]);
  }

  // --------------------------------------- find all PDA addresses

  async fetchAllMountsPDAs() {
    const pdas = await this.breedProgram.account.data.all();
    console.log(`found a total of ${pdas.length} Mount PDAs`);
    return pdas;
  }

  // --------------------------------------- breed ops ixs

  async initMountDataAccount(
    mountMintPubkey: PublicKey,
    mountTokenPubkey: PublicKey,
    mountDataPubKey: PublicKey,
    mountDataBump: number,
  ) {
    // const [mount_data_pubkey, mount_a_bump] = await this.findMountPDA(mountMintPubkey)
    const initIxs: anchor.web3.TransactionInstruction[] = [
      this.breedProgram.instruction.initialize(mountDataBump, {
        accounts: {
          user: this.provider.wallet.publicKey,
          mountDataAccount: mountDataPubKey,
          mountMintAccount: mountMintPubkey,
          mountTokenAccount: mountTokenPubkey,
          systemProgram: SystemProgram.programId,
        }
      }
      )
    ]
    return initIxs
  }

  async redeemCustomToken(
    mountAMintPubKey: PublicKey,
    mountATokenPubKey: PublicKey,
    mountADataPubKey: PublicKey,
    mountBMintPubKey: PublicKey,
    mountBTokenPubKey: PublicKey,
    mountBDataPubKey: PublicKey,
    mtmTokenAccount: PublicKey
  ) {
    const mount_a_metadata = await programs.metadata.Metadata.getPDA(mountAMintPubKey);
    const mount_b_metadata = await programs.metadata.Metadata.getPDA(mountBMintPubKey);
    const [vault_account_pda, _vault_account_bump] = await this.findVaultPDA();
    const [escrow_account_pda, _escrow_account_bump] = await this.findEscrowPDA();
    const [vault_authority_pda, _vault_authority_bump] = await this.findVaultAuthoriyPDA();
    const redeemIxs: anchor.web3.TransactionInstruction[] = []

    const custom_token_account_pubkey = await this.findATA(new PublicKey(DEFAULTS.CUSTOM_MINT), this.provider.wallet.publicKey);
    const customTokenAccountExists = await this.conn.getAccountInfo(custom_token_account_pubkey);
    if (!customTokenAccountExists) {
      redeemIxs.push(
        createAssociatedTokenAccountInstruction(
          custom_token_account_pubkey,
          this.provider.wallet.publicKey,
          this.provider.wallet.publicKey,
          new PublicKey(DEFAULTS.CUSTOM_MINT)
        )
      )
    }

    redeemIxs.push(
      this.breedProgram.instruction.redeem({
        accounts: {
          user: this.wallet.publicKey,
          mountDataAccountA: mountADataPubKey,
          mountDataAccountB: mountBDataPubKey,
          userMountMintAccountA: mountAMintPubKey,
          userMountTokenAccountA: mountATokenPubKey,
          metadataMountA: mount_a_metadata,
          userMountMintAccountB: mountBMintPubKey,
          userMountTokenAccountB: mountBTokenPubKey,
          metadataMountB: mount_b_metadata,
          userCustomTokenAccount: custom_token_account_pubkey,
          userMtmTokenAccount: mtmTokenAccount,
          vaultAccount: vault_account_pda,
          escrowAccount: escrow_account_pda,
          mintMtm: new PublicKey(DEFAULTS.MTM_MINT),
          vaultAuthority: vault_authority_pda,
          tokenProgram: TOKEN_PROGRAM_ID,
        }
      })
    )
    return redeemIxs
  }

  async initAndRedeemCustomToken(
    mountAMintPubKey: PublicKey,
    mountATokenPubKey: PublicKey,
    mountBMintPubKey: PublicKey,
    mountBTokenPubKey: PublicKey,
    mtmTokenAccount: PublicKey
  ) {
    const [mount_a_data_pubKey, mount_a_bump] = await this.findMountPDA(mountAMintPubKey)
    const [mount_b_data_pubKey, mount_b_bump] = await this.findMountPDA(mountBMintPubKey)
    const mount_a_data_exists = await this.provider.connection.getAccountInfo(mount_a_data_pubKey);
    const mount_b_data_exists = await this.provider.connection.getAccountInfo(mount_b_data_pubKey);
    const init_and_redeem_ixs: anchor.web3.TransactionInstruction[] = []

    if (!mount_a_data_exists) {
      const init_mount_a_data_ixs = await this.initMountDataAccount(
        mountAMintPubKey,
        mountATokenPubKey,
        mount_a_data_pubKey,
        mount_a_bump,
      )
      init_and_redeem_ixs.push(...init_mount_a_data_ixs)
    }

    if (!mount_b_data_exists) {
      const init_mount_b_data_ixs = await this.initMountDataAccount(
        mountBMintPubKey,
        mountBTokenPubKey,
        mount_b_data_pubKey,
        mount_b_bump,
      )
      init_and_redeem_ixs.push(...init_mount_b_data_ixs)
    }

    const redeem_custom_token_ixs = await this.redeemCustomToken(
      mountAMintPubKey,
      mountATokenPubKey,
      mount_a_data_pubKey,
      mountBMintPubKey,
      mountBTokenPubKey,
      mount_b_data_pubKey,
      mtmTokenAccount,
    )
    init_and_redeem_ixs.push(...redeem_custom_token_ixs)
    return init_and_redeem_ixs
  }

  async initRedeemMintVoxel(
    mountAMintPubKey: PublicKey,
    mountATokenPubKey: PublicKey,
    mountBMintPubKey: PublicKey,
    mountBTokenPubKey: PublicKey,
    mtmTokenAccount: PublicKey
  ) : Promise<void | string[]>{
    const instructionsMatrix: anchor.web3.TransactionInstruction[][] = [];
    const signersMatrix: anchor.web3.Keypair[][] = [];
    const initAndRedeemCustomTokenIxs = await this.initAndRedeemCustomToken(
      mountAMintPubKey,
      mountATokenPubKey,
      mountBMintPubKey,
      mountBTokenPubKey,
      mtmTokenAccount,
    );
    instructionsMatrix.push(initAndRedeemCustomTokenIxs)
    signersMatrix.push([])

    const cndy = await getCandyMachineState(
      this.provider.wallet as anchor.Wallet,
      new PublicKey(DEFAULTS.CANDY_MACHINE_ID),
      this.provider.connection,
    );
    const [mintOneTokenIxsMatrix, mintOneTokenSignersMatrix] = await mintOneTokenMatrix(
      cndy,
      this.provider.wallet.publicKey
    );
    instructionsMatrix.push(...mintOneTokenIxsMatrix)
    signersMatrix.push(...mintOneTokenSignersMatrix)

    console.log(instructionsMatrix)
    console.log(signersMatrix)

    const txIds = await sendTransactions(
      this.provider.connection,
      this.provider.wallet as anchor.Wallet,
      instructionsMatrix,
      signersMatrix,
      SequenceType.StopOnFailure,
      'singleGossip',
      () => { },
      () => false,
      undefined,
      [],
      []
    ).then(res => res.txs.map(t => t.txid))
      .catch(e => console.log(e));
    
    return txIds
  }
}