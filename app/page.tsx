'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    ConnectionProvider,
    useConnection,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletMultiButton,
    WalletDisconnectButton,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import WalletInfo from '@/components/WalletInfo';
import CoinFlipGame from '@/components/CoinFlipGAme';

const DynamicWalletInfo = dynamic(() => import('@/components/WalletInfo'), { ssr: false });
const DynamicCoinFlipGame = dynamic(() => import('@/components/CoinFlipGAme'), { ssr: false });

const Page = () => {
    const [network, setNetwork] = useState<WalletAdapterNetwork | null>(null);

    useEffect(() => {
        setNetwork(WalletAdapterNetwork.Devnet);
    }, []);

    if (!network) {
        return null; // Render nothing on the server
    }
    
    const endpoint = clusterApiUrl(network);

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="wallet-connection flex flex-col items-center mt-8 mb-4 space-y-4">
                        <WalletMultiButton className="mb-2"/>
                        <WalletDisconnectButton className="mb-2"/>
                        <WalletInfo />
                    </div>
                    <CoinFlipGame />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};


export default Page;
