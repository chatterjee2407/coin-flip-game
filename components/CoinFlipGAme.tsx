import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConfirmOptions, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import LottieAnimation from '@/components/LottieAnimation'; // Adjust path as needed


const CoinFlipGame = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction   } = useWallet();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
    const [gameResult, setGameResult] = useState<string | null>(null);
    const [isFlipping, setIsFlipping] = useState<boolean>(false);

    const handleBet = async () => {
        if (!publicKey) {
            alert('Please connect your wallet first.');
            return;
        }

        // Check the network
        const currentNetwork = connection.rpcEndpoint.includes('devnet') ? 'Devnet' : 'Mainnet';
        if (currentNetwork !== 'Devnet') {
            alert('Please switch your wallet to the Devnet network.');
            return;
        }

        // Convert betAmount from SOL to lamports and ensure it's an integer
        const betAmountInLamports = BigInt(Math.floor(betAmount * 1_000_000_000));

        setIsFlipping(true);
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        const isWinner = selectedSide === outcome;
        setTimeout(() => {
            setGameResult(isWinner ? 'You won!' : 'You lost!');
            setIsFlipping(false);
        }, 2000);

        try {
            let transaction = new Transaction();

            if (isWinner) {
                transaction .add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: publicKey,
                    lamports: betAmountInLamports * BigInt(2),
                    })
                );
            } else {
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: new PublicKey('FkVeBqCaaBDoVhHMZaWrh4dmp1jCZPcq8RBcw88ZM2qp'), 
                        lamports: betAmountInLamports,
                    })
                );
            }

            const signature  = await sendTransaction(transaction, connection);

            const confirmOptions: ConfirmOptions = {
                commitment: 'confirmed',
                preflightCommitment: 'processed'
            };

            await new Promise<void>((resolve, reject) => {
                const confirmInterval = setInterval(async () => {
                    try {
                        const status = await connection.getTransaction(signature, confirmOptions);
                        if (status) {
                            clearInterval(confirmInterval);
                            resolve();
                        }
                    } catch (error) {
                        clearInterval(confirmInterval);
                        reject(error);
                    }
                }, 1000); // Poll every second
            });

            const transactionUrl = `https://solscan.io/tx/${signature}?cluster=devnet`;
            alert(`Transaction successful! You can view it on Solscan: ${transactionUrl}`);
            console.log(`Transaction URL: ${transactionUrl}`);

        } catch (error) {
            console.error(error);
            alert('Transaction failed! Error: ${error.message}`');
        }
    };

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Coin Flip Game</h1>
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl inline-block">
                <div className={`coin-display ${isFlipping ? 'animate-spin' : ''} mb-6`}>
                    <div className="w-32 h-32 bg-yellow-300 rounded-full mx-auto flex items-center justify-center">
                        {selectedSide === 'heads' ? '🪙' : '🪙'}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                        Bet Amount (in SOL):
                        <input
                            type="number"
                            className="ml-2 p-2 border border-gray-300 rounded-md w-32"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="mr-4 text-sm font-medium">
                        <input
                            type="radio"
                            name="side"
                            value="heads"
                            checked={selectedSide === 'heads'}
                            onChange={() => setSelectedSide('heads')}
                            className="mr-2"
                        />
                        Heads
                    </label>
                    <label className="text-sm font-medium">
                        <input
                            type="radio"
                            name="side"
                            value="tails"
                            checked={selectedSide === 'tails'}
                            onChange={() => setSelectedSide('tails')}
                            className="mr-2"
                        />
                        Tails
                    </label>
                </div>
                <button
                    onClick={handleBet}
                    className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                    disabled={isFlipping}
                >
                    {isFlipping ? <LottieAnimation isPlaying={true} /> : 'Flip Coin'}
                </button>
            </div>
            {gameResult && <p className="mt-8 text-2xl font-semibold">{gameResult}</p>}
        </div>
    );
};

export default CoinFlipGame;
