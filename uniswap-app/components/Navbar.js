import Image from 'next/image'

export default function Navbar() {
    return (
        <div>
            <div>
                <nav className="p-3 bg-dark-50 rounded border-dark-200 dark:bg-dark-800 dark:border-gray-700">
                    <div className="container flex flex-wrap justify-between items-center mx-auto">
                        <div className="flex items-center">
                            <Image src="/uniswap.png" alt="uniswap logo" height={50} width={50} />
                        </div>
                        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                            <ul>
                                <li>
                                    <button>Login With MetaMask</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}