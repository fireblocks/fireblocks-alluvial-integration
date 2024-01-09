//General dependencies
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');

const ethers = require("ethers");

//Update with Goerli and mainnet accordingly. The following is testnet to start
const CONTRACT_ADDRESS = "0x080b3a41390b357Ad7e8097644d1DEDf57AD3375";
const INFURA_SECRET = process.env.INFURA_SECRET;
const ABI = require("./RedeemManagerMain.json").abi;
 
async function main(){
    const provider = new ethers.providers.WebSocketProvider(
        `wss://goerli.infura.io/ws/v3/${INFURA_SECRET}`, "goerli"
      );

    const redeemManagerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());

    redeemManagerContract.on("RequestedRedeem",(owner, height, amount, maxRedeemableEth, id) => {
      console.log('RequestedRedeem event');
      console.log(`Owner of redeem ${owner}`)
      console.log(`Height ${height.toString()}`);
      console.log(`Amount of LsETH to redeem ${amount.toString()}`);
      console.log(`Maximum amount of ETH to redeem ${maxRedeemableEth.toString()}`);
      console.log(`Request Redeem ID ${id}`);
    });

    redeemManagerContract.on("ReportedWithdrawal",(height, amount, ethAmount, id) => {
      console.log('ReportedWithdrawal event');
      console.log(`Height ${height.toString()}`);
      console.log(`Amount of LsETH to redeem ${amount.toString()}`);
      console.log(`ETH amount being withdrawn ${ethAmount.toString()}`);
      console.log(`Withdrawal event ID ${id}`);
    });

    redeemManagerContract.on("SatisfiedRedeemRequest",(redeemRequestId, withdrawalEventId,lsEthAmountSatisfied, ethAmountSatisfied, lsEthAmountRemaining, ethAmountExceeding) => {
      console.log('SatisfiedRedeemRequest event');
      console.log(`Redeem Request ID ${redeemRequestId}`);
      console.log(`Withdrawal event ID ${withdrawalEventId}`);
      console.log(`Amount of LsETH satisfied ${lsEthAmountSatisfied.toString()}`);
      console.log(`Amount of ETH satisfied  ${ethAmountSatisfied.toString()}`);
      console.log(`Amount of LsETH left to satisfy ${lsEthAmountRemaining.toString()}`);
      console.log(`Amount of ETH added to buffer  ${ethAmountExceeding.toString()}`);

    });

    redeemManagerContract.on("ClaimedRedeemRequest",(redeemRequestId,recipient, ethAmount, lsEthAmount,  remainingLsEthAmount) => {
      console.log('ClaimedRedeemRequest event');
      console.log(`Redeem Request ID ${redeemRequestId}`);
      console.log(`Recipent of redeem request ${recipient}`);
      console.log(`Amount of ETH ${ethAmount.toString()}`)
      console.log(`Amount of LsETH ${lsEthAmount.toString()}`)
      console.log(`Amount of remaining LsETH ${remainingLsEthAmount.toString()}`)
    });
}
main();
