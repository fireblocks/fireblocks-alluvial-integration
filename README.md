

## Alluvial Staking with Fireblocks - POC

# What is it?
This repo describes the setup and instructions to use [Alluvial](http://alluvial.finance) to do liquid staking on Mainnet and Testnet using ETH. The following functions are supported by Fireblocks: Staking, claiming, and redeeming. 

At a high level, we are staking by sending to a contract address, and unstaking (redeem + claim) by making Smart Contract calls to Alluvial.


## Local setup

Clone repo via: 

`git clone`

Install packages:

```npm start```

Grab Client secret and token from OnePass, link is in the shared slack channel #fireblocks-alluvial.

Add to .env: `API_TESTNET_CLIENT_ID` and `API_TESTNET_CLIENT_SECRET` with appropriate values.

Be sure you also have an API key user, with valid TAP permissions to call and interact with transfers, as we will be using the Fireblocks web3 provider.

Be sure you have the private key file you generated with the CSR when you generated this API user.

If you haven't already, run `npm install`
 
## Usage
To use the functions, uncomment the line that calls each function. For example, if you'd like to run `createRedeemRequest()`, be sure it is uncommented, and run:

```node unstake.js```


## To stake

Using the console, either in a whitelisted external address, or a one-time address, create a transfer and
send desired ETH to stake to:

[Mainnet](https://etherscan.io/tokenholdings?a=0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549)

or here on [Goerli Testnet](https://goerli.etherscan.io/address/0x3ecCAdA3e11c1Cc3e9B5a53176A67cc3ABDD3E46).

Note here that they're using the TUP Proxy pattern, so have different contract addresses for LsETH, and the implementation itself.


Add the contract address as an ERC20 asset to see your LsETH once it's staked.
![LsETH screenshot](./LsETH-sc.png)


## Unstaking

Unstaking will require two steps, and separate smart contract calls. 
1. Submitting a Redeem Request
2. Claim Request Redeem once the redemption is ready for claiming. 

First, be sure you have the right ABI Contract.

`ContractMain.json` for mainnet and `ContractTest.json` for testnet. Replace the value appropriately in the code in `unstake.js`:

```
const ABI = require("./ContractMain.json").abi;
```

*Redeem Request:*

Uncomment and call the function `createRedeemRequest`. Be sure that the amount to claim, and the contract address is updated accordingly. 

Voila, the RedeemRequest should be successfully submitted. You can poll this by calling the following endpoint: `https://api.alluvial.finance/eth/v0/redeems?owner=<address>`

Be sure the smart contract is whitelisted, and you should see it execute in the fireblocks console as it fires. Approve the transaction using your mobile device.

> Add POSTMAN LINK

*Claiming*:

Uncomment and call the function `createClaimRedeemRequest`. Be sure that the request and withdrawal ID is updated with the values from the above API endpoint.

See the smart contract function execute and your ETH balance reflect the claim successfully!


### Delisting a wallet
Key we use is {tenant-id}:{vault-id}. 

List depositors via: 
GET https://api.alluvial.finance/v0/depositors/

Remove the depositor: 
PATCH: https://api.alluvial.finance/v0/depositors/68801f58-c1e4-4e09-89cb-529b6823e967:8/remove


## Links/Resources

- Postman link
- [Alluvial Integration Guide](https://docs.alluvial.finance/third-party-guides/fireblocks-integration)
- [Fireblocks web3 provider](https://github.com/fireblocks/fireblocks-web3-provider/)









# fireblocks-alluvial-integration
