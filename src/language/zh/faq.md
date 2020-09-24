# Frequently Asked Questions

## What is evodex?

Evodex is a decentralized exchange that allows swapping amongst any EOSio compatible tokens, including cross-chain wrapped tokens like pBTC. The liquidity for market making is provided by users who transfer their funds to liquidity pools in exchange for fees that can be voted upon by all of the liquidity providers.

## How is evodex unique?

The main new feature introduced by evodex is that liquidity providers can vote for the fees they want to charge, this is done using a smart contract that calculates each voter's weight in proportion to the stake they have on the pool.

Another difference between evodex and other platforms comes from the different blockchains where they operate, traders only pay fees to liquidity providers, but they don't have to pay transfer fees like in Ethereum and other networks.

## What are Evotokens?

For each registered pair there will be a standard token backed by the assets in the corresponding pair of pools. These new tokens can be freely transferred, facilitating the access and management of the investment position. These tokens are called “evotokens”.

Each trading pair has an associated fee value that might be variable. The value of evotokens rises as fees are collected from the exchange and the addition of liquidity operations. The action of removing liquidity (selling evotokens) is free of charge.

## How can I provide Liquidity to a pool?

You can go to the “Liquidity” section to add or remove liquidity. You need to have the same amount (in value) of both tokens of the pool to provide liquidity. When providing liquidity you have to pay the pool’s fee, this is done to prevent a flash attack when someone would join a pool, change the fee and then quickly exit. Removing liquidity has no fees. 

## How can I vote on the pool’s fee?

Once you have provided liquidity to a pool you are entitled to vote on the fee that future traders and liquidity providers pay. To vote, go to the “vote fee” tab and select any value from 0.01% to a maximum of 3%, the contract will then average your vote based on the porcentage you own of the pool and update the fee accordingly.

## Can I create my own trading pair?

The creation of trading pairs is not yet supported in our front-end, however the protocol is open and anyone can create a trading pair invoking the “evolutiondex” smart contract. More info can be found on [Evolution Dex’s Github](https://github.com/eosargentina/evolutiondex)

## Can I retire my tokens at any time?

Yes, you can retire your tokens at any time by selling your evotokens in the liquidity tab.

## Why does the price change with higher amounts?

The price of a token swap is determined by the balances of the pool. If the liquidity is low compared to the amount you want to exchange you can suffer price slippage.
