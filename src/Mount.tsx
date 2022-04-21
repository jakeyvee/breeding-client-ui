import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { MountInfoInt } from "./Breed";
import * as anchor from "@project-serum/anchor";
import { Breed, initBreed } from "./helper/breed-init";
import { DEFAULTS } from "./helper/globals";

interface MountProps {
  mountInfoInt: MountInfoInt;
  selectedMounts: MountInfoInt[];
  setSelectedMounts: React.Dispatch<React.SetStateAction<MountInfoInt[]>>;
  connection: anchor.web3.Connection;
}


export const MountUI = (props: MountProps) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [used, setUsed] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      (async () => {
        const breed = await initBreed(props.connection, wallet as anchor.Wallet);
        const [mount_pda, _mount_bump] = await breed.findMountPDA(props.mountInfoInt.mint);
        const mountDataAccountExists =  await props.connection.getAccountInfo(mount_pda);
        if (mountDataAccountExists) {
          const mountDataAccount = await breed.fetchMountPDA(mount_pda);
          setUsed(mountDataAccount.count)
          const interval = setInterval(() => {
            const timeNow = Math.floor(Date.now() / 1000);
            const timeElapsed = timeNow - mountDataAccount.timestamp.toNumber()
            const cooldown = DEFAULTS.MIN_COOLDOWN - timeElapsed
            setCooldown(cooldown);
          }, 1000);
          return () => clearInterval(interval);
        }
      })();
    }
  }, [wallet, props.connection, props.mountInfoInt.mint])

  const onSelect = () => {
    if ((used < 5) && (cooldown <= 0)) {
      if (props.selectedMounts.includes(props.mountInfoInt))
        props.setSelectedMounts(props.selectedMounts.filter(x => x !== props.mountInfoInt))
      else
        props.setSelectedMounts([...props.selectedMounts.slice(props.selectedMounts.length - 1), props.mountInfoInt])
    }
  }
  return (
    <>
      {props.mountInfoInt.imageUrl === "loading" && (
        <div className="w-full bg-gray-700 animate-pulse rounded-lg">
          <div style={{ marginTop: "100%" }}></div>
        </div>
      )}
      {props.mountInfoInt.imageUrl !== "loading" && (
        <div 
          onClick={onSelect} 
          className={`${props.selectedMounts.includes(props.mountInfoInt)? "border-blue-400 ": ""}
          ${((used < 5) && (cooldown <= 0))? "cursor-pointer hover:border-blue-400 bg-white " : "cursor-not-allowed bg-gray-200 "}
          flex-row rounded-xl shadow border-2 border-transparent`}>
          <div className="flex relative justify-center h-0" style={{ paddingBottom: "100%" }}>
            <img
              className={`rounded-t-lg absolute inset-0 w-full ${imgLoading ? "hidden" : ""}`}
              alt="example"
              src={
                props.mountInfoInt.imageUrl.toString() === ""
                  ? "https://user-images.githubusercontent.com/47315479/81145216-7fbd8700-8f7e-11ea-9d49-bd5fb4a888f1.png"
                  : props.mountInfoInt.imageUrl.toString()
              }
              onLoad={() => setImgLoading(false)}
            />
            <div className={`w-full bg-gray-700 animate-pulse rounded-t-lg ${imgLoading ? "" : "hidden"}`}>
              <div style={{ marginTop: "100%" }}></div>
            </div>
          </div>
          <div className="text-gray-600 py-3 px-3 tracking-tightest">
            <p className="text-gray-800 text-base text-center">{props.mountInfoInt.name}</p>
            <p className="mt-2 text-xs">Used: {used}/5</p>
            <p className="text-xs">Cooldown: {cooldown <= 0? "Ready!": `${Math.floor(cooldown/3600)}Hrs ${Math.ceil((cooldown%3600)/60)}Mins`}</p>
          </div>
        </div>
      )}
    </>
  );
};
