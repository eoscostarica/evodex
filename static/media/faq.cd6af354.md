# Frequently Asked Questions

## What is Evodex?

Evodex is a decentralized exchange that allows swapping amongst any EOS token, including cross-chain wrapped tokens like pBTC. The liquidity for market making is provided by users who transfer their funds to liquidity pools in exchange for fees that can be voted upon by the liquidity providers of each pair.

## How is Evodex unique?

The main new feature introduced by Evodex is that liquidity providers can vote for the fees they want to charge, this is done using a smart contract that calculates each voter's weight in proportion to the stake they have on the pool.

Another difference between Evodex and other platforms comes from the different blockchains where they operate, traders only pay fees to liquidity providers, but they don't have to pay transfer fees like in Ethereum and other networks.

## What are evotokens?

For each registered pair there will be a standard token backed by the assets in the corresponding pool. These new tokens can be freely transferred, facilitating the access and management of the investment position. They are called “evotokens”.
Each trading pair has a variable fee value between 0.1% and 1%. The value of evotokens rises as fees are collected. 

## How can I provide liquidity to a pool?

You can go to the “liquidity” section to add or remove liquidity. You need to have the same amount (in value) of both tokens of the pool to provide liquidity. When providing liquidity you have to pay a tiny fee of 0.01% that goes to the pool. This is done to prevent the following flash attack: join a pool, change the fee to the minimum, make a swap and then exit, all in the same transaction. 
Removing liquidity has no fees. 

## How can I vote on the pool’s fee?

Once you have provided liquidity to a pool you are entitled to vote on the fee that future traders will pay. To vote, go to the “vote fee” tab and select a value from 0.1% to a maximum of 1%. The contract will enter your vote weighted by your share of the pool and update the fee to the weighted median of the votes.

## Can I create my own trading pair?

The creation of trading pairs on the contract evolutiondex is not open to the public, but it is expected to be part of the future decentralized governance model. The codes of the smart contracts are public and can be found at [Evolution Dex’s Github](https://github.com/eosargentina/evolutiondex)

## Can I retire my tokens at any time?

Yes, you can retire your tokens at any time by selling your evotokens in the liquidity tab.

## Why does the price change with higher amounts?

The price of a token swap is determined by the balances of the pool. If the liquidity is low compared to the amount you want to exchange you can suffer considerable price slippage.