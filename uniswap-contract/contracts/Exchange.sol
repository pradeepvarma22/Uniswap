// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public varmaTokenAddress;

    constructor(address _varmaTokenAddress)
        ERC20("Liquidity Pool Token", "LP")
    {
        varmaTokenAddress = _varmaTokenAddress;
    }





    /*
        amount of varma tokens send by msg.sender (dx)            Eth Sent by the user (dy)
        -------------------------------------------   =   ----------------------------------------------------
        varma tokens Reserve in the contract      (x)              Eth Reserve in the contract (y)

        we need to calculate minimum amount of tokens required to pool 

        minVarmaTokensRequired [ dx  ] =  dy * x / y 

    */

    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 varmaTokenReserve = getReserve();
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;


        if (varmaTokenReserve == 0)
        {
            ERC20(varmaTokenAddress).transferFrom(msg.sender, address(this), _amount);
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        }
        else
        {
            uint256 ethReserve = ethBalance - msg.value ;
            uint256 dx =  msg.value * varmaTokenReserve / ethReserve;
            require( _amount >= dx, "Amount Send by user is less");
            ERC20(varmaTokenAddress).transferFrom(msg.sender, address(this), dx);
            
            // we have varma tokens we need to provide lp tokens to recognise who send value to this contract
            // lp tokens will be in ratio of eth
            // LP tokens to be sent to the user / totalSupply of LP tokens in contract = Eth sent by the user / Eth reserve in the contract
            // LP tokens to be sent to the user = totalSupply of LP tokens in contract * Eth sent by the user / Eth reserve in the contract
            liquidity = totalSupply() * msg.value / ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }


    /*
        Eth sent back to the user / (current Eth reserve) = (amount of LP tokens that user wants to withdraw) / (total supply of LP tokens)
        Eth sent back to the user = current Eth reserve * amount of LP tokens that user wants to withdraw   / total supply of LP tokens



        varma tokens sent back to the user / varma token reserve = amount of LP tokens that user wants to withdraw / total supply of LP tokens
        varma tokens sent back to the user = varma token reserve  * amount of LP tokens that user wants to withdraw / total supply of LP tokens

    */



    function removeLiquidity(uint _amount) public returns (uint , uint)
    {
        require(_amount > 0, "_amount should be greater than zero");

        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        uint ethAmountSendBackToUser = (ethReserve * _amount)/ _totalSupply;
        uint varmaTokenAmount = ( getReserve() * _amount)/ _totalSupply;
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmountSendBackToUser);
        ERC20(varmaTokenAddress).transfer(msg.sender, varmaTokenAmount);

        return (ethAmountSendBackToUser, varmaTokenAmount);
    }



    function ethToVarmaToken(uint256 _minTokens) public payable
    {
        uint256 tokenReserve = getReserve();
        uint256 tokensBought =  getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require( tokensBought >= _minTokens ,"insufficient output amount" );

        ERC20(varmaTokenAddress).transfer(msg.sender, tokensBought);
    }


    function varmaTokenToEth(uint _tokensSold, uint _minEth) public
    {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );
        require(ethBought >= _minEth, "insufficient output amount");
        ERC20( varmaTokenAddress ).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(ethBought);
    } 

    
    function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns(uint256)
    {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint256 inputAmountWithFees = inputAmount/99;
        uint256 numerator = inputAmountWithFees * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFees;
        return numerator/denominator;
    }




    function getReserve() public view returns (uint256) {
        return ERC20(varmaTokenAddress).balanceOf(address(this));
    }
}
