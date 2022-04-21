import './App.css';
import { useEffect, useMemo, useRef } from 'react';
import * as anchor from '@project-serum/anchor';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';

import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from '@solana/wallet-adapter-wallets';

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';

import { ThemeProvider, createTheme } from '@material-ui/core';
import BreedUI from './Breed';
import { Breed, initBreed } from './helper/breed-init';
import { DEFAULTS } from './helper/globals';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID!,
    );

    return candyMachineId;
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(
  DEFAULTS.RPC_HOST
);

const txTimeoutInMilliseconds = 30000;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <style>{css}</style>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="mb-auto">
                <BreedUI
                  candyMachineId={candyMachineId}
                  connection={connection}
                  txTimeout={txTimeoutInMilliseconds}
                  rpcHost={rpcHost}
                />
              </div>
              <Footer />
            </div>
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

const css = `
@font-face {
  font-family:"Apple";
  src: url("/font/Apple ][.ttf") format("truetype");
}

h1 {
    font-family: 'Apple', san-serif;
    font-weight: 800;
}

h2 {
    font-family: 'Apple', san-serif;
}

p {
    font-family: 'Apple', san-serif;
    font-weight: 600;
}
`

export default App;
