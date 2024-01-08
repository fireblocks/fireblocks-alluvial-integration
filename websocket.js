//General dependencies
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');

//Fireblocks SDKs
const { FireblocksSDK } = require('fireblocks-sdk');
const { FireblocksWeb3Provider, ChainId } = require("@fireblocks/fireblocks-web3-provider");

const ethers = require("ethers");

const baseUrl = "https://api.fireblocks.io";

//Put Secret Key file here
const apiSecret = fs.readFileSync(path.resolve("../fireblocks_secret.key"), "utf8");

const apiKey = process.env.API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS.toLowerCase();
const FIREBLOCKS_ADDRESS = "0x2e9E16e6deB4022399E4FCd387bCB59Ac5855762";
const walletAddress = process.env.WALLET_ADDRESS.toLowerCase();
const INFURA_SECRET = process.env.INFURA_SECRET;

const ABI = require("./RedeemManagerMain.json").abi;


//BE SURE TO UPDATE THESE VALUES for main and testnet.
// const eip1193Provider = new FireblocksWeb3Provider({
//     apiBaseUrl: baseUrl,
//     privateKey: apiSecret,
//     apiKey: apiKey,
//     vaultAccountIds: "2",
//     chainId: ChainId.GOERLI,

//     logTransactionStatusChanges: true // Verbose logging
// })
// const provider = new ethers.providers.Web3Provider(eip1193Provider);

const checkRedeemEvent = async () => {
    //insert secret here below. Replace Goerli with any other
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
}
checkRedeemEvent();

const checkWithdrawalEvent = async () => {
    const provider = new ethers.providers.WebSocketProvider(
        `wss://goerli.infura.io/ws/v3/${INFURA_SECRET}`, "goerli"
      );
    
    const redeemManagerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());

    redeemManagerContract.on("ReportedWithdrawal",(height, amount, ethAmount, id) => {
        console.log('ReportedWithdrawal event');
        console.log(`Height ${height.toString()}`);
        console.log(`Amount of LsETH to redeem ${amount.toString()}`);
        console.log(`ETH amount being withdrawn ${ethAmount.toString()}`);
        console.log(`Withdrawal event ID ${id}`);
    });
}

//checkWithdrawalEvent

const checkClaimedRedeemRequest = async () => {
    const provider = new ethers.providers.WebSocketProvider(
        `wss://goerli.infura.io/ws/v3/${INFURA_SECRET}`, "goerli"
      );
    
    const redeemManagerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
    
    redeemManagerContract.on("ClaimedRedeemRequest",(redeemRequestId,recipient, ethAmount, lsEthAmount,  remainingLsEthAmount) => {
        console.log('ClaimedRedeemRequest event');
        console.log(`Redeem Request ID ${redeemRequestId}`);
        console.log(`Recipient of redeem request ${recipient}`);
        console.log(`Amount of ETH ${ethAmount.toString()}`)
        console.log(`Amount of LsETH ${lsEthAmount.toString()}`)
        console.log(`Amount of remaining LsETH ${remainingLsEthAmount.toString()}`)
    });
}
//checkClaimedRedeemRequest

const checkSatisfiedRedeemRequest = async () => {
    const provider = new ethers.providers.WebSocketProvider(
        `wss://goerli.infura.io/ws/v3/${INFURA_SECRET}`, "goerli"
      );
    
    const redeemManagerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
    
    redeemManagerContract.on("SatisfiedRedeemRequest",(redeemRequestId, withdrawalEventId,lsEthAmountSatisfied, ethAmountSatisfied, lsEthAmountRemaining, ethAmountExceeding) => {
        console.log('SatisfiedRedeemRequest event');
        console.log(`Redeem Request ID ${redeemRequestId}`);
        console.log(`Withdrawal ID ${withdrawalEventId}`);
        console.log(`Amount of LsETH satisfied ${lsEthAmountSatisfied.toString()}`);
        console.log(`Amount of ETH satisfied  ${ethAmountSatisfied.toString()}`);
        console.log(`Amount of LsETH left to satisfy ${lsEthAmountRemaining.toString()}`);
        console.log(`Amount of ETH added to buffer  ${ethAmountExceeding.toString()}`);
    
      });
    
}
//checkSatisfiedRedeemRequest

