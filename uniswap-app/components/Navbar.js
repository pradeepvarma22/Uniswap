import Image from 'next/image'
import { ethers } from 'ethers';
import { useState } from 'react';

export default function Navbar({ isActive, setIsActive, provider, setProvider, signer, setSigner }) {

    const [walletAddress, setWalletAddress] = useState("");

    async function login() {


        try {

            const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            await _provider.send("eth_requestAccounts", []);
            const _signer = await _provider.getSigner();
            const _walletAddress = await _signer.getAddress()
            setProvider(_provider);
            setSigner(_signer);
            setIsActive(true);
            setWalletAddress(_walletAddress);

        } catch (error) {
            console.log(error);
        }


    }


    return (
        <div>
            <div>
                <nav className="p-3 bg-dark-50 rounded border-dark-200 dark:bg-dark-800 dark:border-gray-700">
                    <div className="container flex flex-wrap justify-between items-center mx-auto">
                        <div className="flex items-center">
                            <Image src="/uniswap.png" alt="uniswap logo" height={50} width={50} />
                        </div>
                        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                            {isActive ? (
                                <div>
                                    <Image src="/metamask-icon.svg" alt="Metamask Wallet Logo" height={15} width={30} />
                                    {walletAddress}

                                </div>

                            ) : (
                                <ul>
                                    <li>
                                        <button onClick={login}>Connect wallet</button>
                                    </li>
                                </ul>
                            )}

                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}