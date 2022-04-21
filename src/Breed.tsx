import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import styled from "styled-components";
import "./MintModal.scss";
import { getMountInfo, getMountsAndMtm } from "./helper/breed-utils";
import { PublicKey } from "@solana/web3.js";
import { LoadingOutlined } from "@ant-design/icons";
import { MountUI } from "./Mount";
import _ from "lodash";
import { initBreed } from "./helper/breed-init";
import { sendTransactions, SequenceType } from "./connection";
import { DEFAULTS } from "./helper/globals";

export interface BreedProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

export interface MountInfoInt {
  token: anchor.web3.PublicKey;
  mint: anchor.web3.PublicKey;
  imageUrl: string;
  name: string;
}

export interface MtmInfoInt {
  token: anchor.web3.PublicKey;
  mint: anchor.web3.PublicKey;
  amount: number;
}

const ConnectButton = styled(WalletDialogButton)``;

const BreedUI = (props: BreedProps) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isRedeeming, setIsRedeeming] = useState<Boolean>(false);
  const [mountsInfoList, setMountsInfoList] = useState<MountInfoInt[]>([]);
  const [selectedMounts, setSelectedMounts] = useState<MountInfoInt[]>([]);
  const [mtmInfo, setMtmInfo] = useState<MtmInfoInt>();

  const rpcUrl = props.rpcHost;
  const wallet = useAnchorWallet();

  const updateMountsAndMtm = async () => {
    setIsLoading(true);
    const [mountsAccounts, mtmAccount]: [MountInfoInt[], MtmInfoInt] =
      await getMountsAndMtm(props.connection, wallet?.publicKey!);
    setIsLoading(false);
    setMtmInfo(mtmAccount);
    setMountsInfoList(mountsAccounts);
    const mountsInfoList: MountInfoInt[] = await Promise.all(
      mountsAccounts.map((mountAccounts) =>
        getMountInfo(mountAccounts, props.connection)
      )
    );
    setMountsInfoList(mountsInfoList);
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        await updateMountsAndMtm();
      }
    })();
  }, [wallet]);

  const onClick = async () => {
    if (eligible && mtmInfo) {
      setIsRedeeming(true);
      const breed = await initBreed(props.connection, wallet as anchor.Wallet);
      const txIds = await breed.initRedeemMintVoxel(
        selectedMounts[0].mint,
        selectedMounts[0].token,
        selectedMounts[1].mint,
        selectedMounts[1].token,
        mtmInfo?.token
      );
      if (txIds) {
        await Promise.all(
          txIds.map((txId) =>
            props.connection.getConfirmedTransaction(txId, "confirmed")
          )
        );
        await updateMountsAndMtm();
      }
      setIsRedeeming(false);
    }
  };

  const eligible = selectedMounts.length === 2 && mtmInfo?.amount! >= DEFAULTS.MTM_AMOUNT;

  return (
    <section className="text-gray-600 body-font">
      <div className="container lg:px-5 pb-24 pt-10 mx-auto">
        <div className="flex flex-wrap w-full flex-col items-center text-center">
          <h1 className="sm:text-5xl text-2xl title-font mb-6 text-gray-700 tracking-tightest">
            Metamounts Breeding
          </h1>
        </div>
        <div className="container mx-auto flex flex-wrap">
          <div className="w-full lg:m-0">
            <div className="sm:flex-row flex-col">
              {!wallet && (
                <div className="flex w-full flex-col items-center text-center">
                  <p className="lg:w-3/4 w-full leading-relaxed lg:text-xl text-base text-gray-600 tracking-tightest font-medium mb-10">
                    The time has come for you to breed 2 mounts together and
                    bring your Metamounts alive - into the 3D realm.
                  </p>
                  <ConnectButton className="flex MintButton2 w-auto">
                    <p>Connect Wallet</p>
                  </ConnectButton>
                </div>
              )}
              <div className="mt-12">
                {isLoading && (
                  <div className="flex justify-center text-6xl py-10">
                    <LoadingOutlined />
                  </div>
                )}
                {wallet && !isLoading && (
                  <div className="shadow-lg bg-sky-blue rounded-lg mb-16 px-10 py-3 flex flex-row space-x-8">
                    <div className="">
                      <div className="stat bg-transparent text-white py-2">
                        <div className="text-sm ">ADDRESS</div>
                        <div className="stat-value text-2xl truncate font-medium">
                          {wallet?.publicKey.toBase58()}
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="stat bg-transparent text-white py-2">
                        <div className="stat-title text-sm">MOUNTS</div>
                        <div className="stat-value text-2xl truncate font-medium">
                          {mountsInfoList?.length}
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="stat bg-transparent text-white py-2">
                        <div className="stat-title text-sm">$MTM</div>
                        <div className="stat-value text-2xl truncate font-medium">
                          {mtmInfo?.amount}
                        </div>
                      </div>
                    </div>
                    <div className=" ml-auto"></div>
                  </div>
                )}
                {!isLoading && !_.isEmpty(mountsInfoList) && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-5 text-white gap-2.5">
                      {mountsInfoList?.map((row, index) => {
                        return (
                          <MountUI
                            selectedMounts={selectedMounts}
                            setSelectedMounts={setSelectedMounts}
                            mountInfoInt={row}
                            connection={props.connection}
                            key={index}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-center">
                      <button
                        disabled={!eligible}
                        onClick={onClick}
                        type="button"
                        className={`${
                          eligible ? `` : `cursor-not-allowed `
                        }flex mt-10 items-center px-5 py-2.5 font-medium shadow-lg text-white capitalize bg-gradient-to-r 
                        from-${eligible ? `green` : `gray`}-300 via-${
                          eligible ? `blue` : `gray`
                        }-500 to-${
                          eligible ? `purple` : `gray`
                        }-600 hover:opacity-75  
                        focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out`}
                      >
                        <div className="flex items-center">
                          {!isRedeeming ? (
                            <p className="text-2xl">BREED</p>
                          ) : (
                            <LoadingOutlined className="text-3xl" />
                          )}
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreedUI;
