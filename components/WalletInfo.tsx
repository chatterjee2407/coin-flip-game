import { useWallet } from '@solana/wallet-adapter-react';

const WalletInfo = () => {
    const { publicKey } = useWallet();

    return (
        <div className='mt-3'>
            {publicKey ? (
                <p>Connected: {publicKey.toBase58()}</p>
            ) : (
                <p>Not connected</p>
            )}
        </div>
    );
};

export default WalletInfo;
