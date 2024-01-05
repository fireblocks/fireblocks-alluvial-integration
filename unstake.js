
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
const apiSecret = fs.readFileSync(path.resolve("./fireblocks_secret.key"), "utf8");

const apiKey = process.env.API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS.toLowerCase();
const FIREBLOCKS_ADDRESS = "0x2e9E16e6deB4022399E4FCd387bCB59Ac5855762";
const walletAddress = process.env.WALLET_ADDRESS.toLowerCase();
const INFURA_SECRET = process.env.INFURA_SECRET;

const ABI = require("./ContractTest.json").abi;

const fireblocks = new FireblocksSDK(apiSecret, apiKey, baseUrl);

//BE SURE TO UPDATE THESE VALUES for main and testnet.
const eip1193Provider = new FireblocksWeb3Provider({
    apiBaseUrl: baseUrl,
    privateKey: apiSecret,
    apiKey: apiKey,
    vaultAccountIds: "2",
    chainId: ChainId.GOERLI,

    logTransactionStatusChanges: true // Verbose logging
})


const createVault = async() => {

    const name = 'LsETH blog'

    const vaultAccount = await fireblocks.createVaultAccount(name);

    console.log(inspect(vaultAccount, false, null, true));
}
//createVault()


const getAssets = async() => {

    const supportedAssets = await fireblocks.getSupportedAssets();

    supportedAssets.forEach((asset, index, array) => {
        if (asset.contractAddress == CONTRACT_ADDRESS) {
            console.log(JSON.stringify(asset))
        }
    })
}
// getAssets()

const addAssetToVault = async() => {

    const vaultWallet = await fireblocks.createVaultAsset(6, 'LSETH_ETH_TEST3_4E2A');

    console.log(inspect(vaultWallet, false, null, true));
}



const getTx = async () => {   
    const transactions = await fireblocks.getTransactions({txHash: '0x95a8e627cbeb83eec690088bbb1b69ae26ecd45c0034f3f0e6a656bbc7357226'});

    console.log(JSON.stringify(transactions))
       
}

// getTx()

const getBalance = async () => { 

const vaultAsset = await fireblocks.getVaultAccountAsset(2, 'LSETH_ETH_TEST3_4E2A');
console.log(JSON.stringify(vaultAsset))

}
//getBalance

const createRedeemRequest = async () => { 

    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    console.log(provider);
    const LsETHContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());

    const value = ethers.utils.parseEther("0.1");

    console.log("creating redeem request for", walletAddress);

    const redeem_estimation = await LsETHContract.estimateGas.requestRedeem(value, FIREBLOCKS_ADDRESS, { gasLimit: 1000});
    const tx = await LsETHContract.requestRedeem(value, FIREBLOCKS_ADDRESS, { gasLimit: redeem_estimation});
    
    //Uncomment for testnet. Mainnet does not allow gas estimation
    // const redeem_estimation = await LsETHContract.estimateGas.requestRedeem(value, walletAddress, { gasLimit: 1000});

    // //use gas limit 6000 for mainnet
    // const tx = await LsETHContract.requestRedeem(value, walletAddress, { gasLimit: 6000});
    let receipt = await tx.wait();
    console.log(receipt)

}
// createRedeemRequest();


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
// checkRedeemEvent

const resolveRedeemRequest = async () => { 

    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    const LsETHContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
    
    const arrRequestId = [101];

    const resolveRedeem = await LsETHContract.resolveRedeemRequests(arrRequestId);
    console.log(resolveRedeem.toString())
}
// resolveRedeemRequest();


const createClaimRedeemRequest = async () => { 

    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    const LsETHContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());

    //replace with redeem request values above
    const arrRequestId = [101];
    const arrWithdrawalId = [202];

    //Uncomment for testnet. Mainnet does not allow gas estimation
    // const claim_estimation = await LsETHContract.estimateGas.claimRedeemRequests(arrRequestId, arrWithdrawalId, { gasLimit: 1000});
    const claimRedeemRequests = await LsETHContract.claimRedeemRequests(arrRequestId, arrWithdrawalId, { gasLimit: 300000});
    const receipt = await claimRedeemRequests.wait();
    console.log(claimRedeemRequests);

}
//createClaimRedeemRequest();

