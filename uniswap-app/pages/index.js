import { ethers } from 'ethers';
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';

import Navbar from "../components/Navbar"
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constant/Exchange/index"
import {TOKEN_CONTRACT_ADDRESS,VARMA_TOKEN_ABI} from "../constant/Token/index"

export default function Home() {

  const [currencyState, setCurrencyState] = useState(true);
  const [currencyStateValue, setCurrencyStateValue] = useState("ETH")

  const [isActive, setIsActive] = useState(false);
  const [provider, setProvider] = useState({});
  const [signer, setSigner] = useState({});

  const [exchangeValue, setExchangeValue] = useState(0);



  const [eth, setEth] = useState();
  const [token, setToken] = useState();


  function changeCurrency() {

    if (currencyState) {
      setCurrencyStateValue("VAR")
      setExchangeValue(0)
      setCurrencyState(false)


      document.getElementById("input1").value = document.getElementById("input1").defaultValue;


    }
    else {
      setCurrencyStateValue("ETH")
      setCurrencyState(true)
      setExchangeValue(0)

      document.getElementById("input1").value = document.getElementById("input1").defaultValue;


    }
  }




  return (
    <div>

      <Navbar isActive={isActive} setIsActive={setIsActive} provider={provider} setProvider={setProvider} signer={signer} setSigner={setSigner} />

      <div>
        <div style={{ paddingTop: '150px', boxSizing: 'content-box', }}>
          <div className={style.wrapper}>
            <div className={style.content}>
              <div className={style.formHeader}>
                <div>  </div>
              </div>
              <div>

                <div className={style.transferPropContainer}>
                  <input
                    id="input1"
                    type="text"
                    className={style.transferPropInput}
                    placeholder="0.0"
                    onChange={getExchangeValue}
                  />
                  <div className={style.currencySelector}>
                    <div onClick={changeCurrency}>
                      <div className={style.currencySelectorContent}>
                        <div className={style.currencySelectorIcon}>
                          {currencyState ? (
                            <div>
                              <Image src="/eth.png" alt="eth logo" height={20} width={20} />
                            </div>
                          ) : (
                            <div>
                              <Image src="/token.png" alt="varma coin" height={20} width={20} />
                            </div>
                          )}

                          <div className={style.currencySelectorTicker}>{currencyStateValue}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className={style.transferPropContainer}>
                  <input
                    type="text"
                    className={style.transferPropInput}
                    placeholder="0.0"
                    value={exchangeValue}
                    readOnly={true}
                  />
                  <div className={style.currencySelector}>
                    <div className={style.currencySelectorContent}>
                      <div className={style.currencySelectorIcon}>
                        {currencyState ? (
                          <div>
                            <Image src="/token.png" alt="varma coin" height={20} width={20} />
                          </div>
                        ) : (
                          <div>
                            <Image src="/eth.png" alt="eth logo" height={20} width={20} />
                          </div>
                        )}
                      </div>
                      <div className={style.currencySelectorTicker}>{currencyState ? (<>VAR</>) : (<>Eth</>)}</div>
                    </div>
                  </div>
                </div>


                <div onClick={(e) => handleSubmit(e)} className={style.confirmButton}>
                  Swap
                </div>
              </div>
            </div>
          </div>

        </div>


      </div>
    </div>

  )


  async function handleSubmit(e) {

    if (!isActive) {
      document.getElementById("input1").value = document.getElementById("input1").defaultValue;

      alert('Please Connect to wallet');
      return;
    }

    try {
      const contract = new ethers.Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);

      let swap_;
      
      const _ethValue =eth;
      const _token = ethers.utils.parseUnits(token.toString());
      if (currencyStateValue == "ETH") {  
        swap_ = await contract.ethToVarmaToken(_token, { value: _ethValue })
      }
      else {

        
        // Approve
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS,VARMA_TOKEN_ABI,signer);
        const _walletAddress = await signer.getAddress()
        

        const txn  = await tokenContract.approve(EXCHANGE_CONTRACT_ADDRESS, ethers.utils.parseUnits(token,18));
        await txn.wait();
        // transferFrom
        swap_ = await contract.varmaTokenToEth(_token, ethers.utils.parseEther(_ethValue))
        await swap_.wait();
      }

      await swap_.wait();
      alert('swap success')

    } catch (error) {

      console.error(error);
      let msg;
      try {
       msg = error

      } catch (error) {
        
      }

      alert(`swap failed due to-> ${msg} `,)
    }

  }

  async function getExchangeValue(e) {

    if (!isActive) {
      document.getElementById("input1").value = document.getElementById("input1").defaultValue;
      alert('Please Connect to wallet');
      return;
    }

    if(!Boolean(e.target.value))
    {
      setExchangeValue(0)
      return;
    }
    

    const contract = new ethers.Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);

    const ethReserveBigNumber = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
    const ethReserve = ethers.utils.formatEther(ethReserveBigNumber);
    const tokenReserveBigNumber = await contract.getReserve();
    const tokenReserve = ethers.utils.formatEther(tokenReserveBigNumber);
    let getExchangeValueBigNumber;
    const _inputBigStr = e.target.value;
    const _inputBig = ethers.utils.parseUnits(e.target.value, 18);

    if (currencyStateValue == "ETH") {
      getExchangeValueBigNumber = await contract.getAmountOfTokens(_inputBig, ethReserveBigNumber, tokenReserveBigNumber)
      setEth(_inputBig);
      const dummy_ = ethers.utils.formatEther(getExchangeValueBigNumber);
      setToken(dummy_);
    }
    else {
      getExchangeValueBigNumber = await contract.getAmountOfTokens(_inputBig, tokenReserveBigNumber, ethReserveBigNumber)
      setToken(_inputBigStr);
      const dummy2 = ethers.utils.formatEther(getExchangeValueBigNumber);
      setEth(dummy2);
    }

    const getExchangeValue_ = ethers.utils.formatEther(getExchangeValueBigNumber);
    setExchangeValue(getExchangeValue_);
  }



}






const style = {
  wrapper: `w-screen flex items-center justify-center mt-14 px-3`,
  content: ` bg-black/80 w-[35rem] backdrop-blur-md	 rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-slate-900  my-3 rounded-2xl p-6 text-3xl  border border-gray-800 hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

