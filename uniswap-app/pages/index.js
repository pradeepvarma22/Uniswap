import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import Navbar from "../components/Navbar"

export default function Home() {



  const [currencyState, setCurrencyState] = useState(true);
  const [currencyStateValue, setCurrencyStateValue] = useState("ETH")

  function changeCurrency() {
    if (currencyState) {
      setCurrencyStateValue("VAR")
      setCurrencyState(false)
    }
    else {
      setCurrencyStateValue("ETH")
      setCurrencyState(true)

    }
  }




  return (
    <div>
      <div>
        <Navbar />
      </div>


      <div>
        <div className="" style={{ paddingTop: '150px', boxSizing: 'content-box', }}>
          <div className={style.wrapper}>
            <div className={style.content}>
              <div className={style.formHeader}>
                <div>Swap</div>
              </div>
              <div clasName="container">

                <div className={style.transferPropContainer}>
                  <input
                    type="text"
                    className={style.transferPropInput}
                    placeholder="0.0"
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
                  Confirm
                </div>
              </div>
            </div>
          </div>

        </div>


      </div>
    </div>

  )
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

