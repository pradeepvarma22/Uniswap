import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

  const _amount = ethers.utils.parseEther("0.0000001");

  // Token Contract
  const contractFact = await ethers.getContractFactory("VarmaToken");
  const tokenContract = await contractFact.deploy();
  await tokenContract.deployed();
  const tokenContractAddress = tokenContract.address;

  // Exchange
  const exchangeFact = await ethers.getContractFactory("Exchange");
  const exchangeContract = await exchangeFact.deploy(tokenContractAddress);
  await exchangeContract.deployed();
  const exchangeContractAddress = exchangeContract.address;

  // Approve
  const aprovetxn = await tokenContract.approve(exchangeContractAddress, ethers.utils.parseUnits("2", 18))
  await aprovetxn.wait();

  // Adding Liquidity for the first time   1:10
  const txn = await exchangeContract.addLiquidity(ethers.utils.parseUnits("2", 18), { value: ethers.utils.parseEther("2") });
  await txn.wait();

  //const getExchangeValueBigNumber = await exchangeContract.getReserve();
  //const getExchangeValue = ethers.utils.formatEther(getExchangeValueBigNumber);
  console.log("Varma Token Contract Address: ", tokenContractAddress);
  console.log("Uniswap Token Contract Address: ", exchangeContractAddress)
  //console.log("Tokens-> ", getExchangeValue)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
