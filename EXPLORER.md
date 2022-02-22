# TrueBlocks Account Explorer

![Image Logo](https://avatars1.githubusercontent.com/u/19167586?s=200&v=4)

[![Website](https://img.shields.io/badge/Website-quickblocks.io-brightgreen.svg)](https://quickblocks.io/)
[![TrueBlocks](https://img.shields.io/badge/Trueblocks-explorer-blue.svg)](https://github.com/Great-Hill-Corporation/trueblocks-explorer)
[![React](https://img.shields.io/badge/React-node.js-purple.svg)](https://reactjs.org/)
[![Twitter](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Twitter)](https://twitter.com/quickblocks?lang=es)

These instructions work only for the Alpha Server-Based version of TrueBlocks. This version is for testing purposes only. They will not work after July 30, 2020.

---

## Installation

Complete the following commands to install the TrueBlocks front-end. (You may have to install `node` and `yarn` -- explained elsewhere.)

Download the code:

```
git clone https://github.com/Great-Hill-Corporation/trueblocks-explorer
cd trueblocks-explorer
```

## Configure the FrontEnd to Use Our Servers

Do these two commands:

```
echo "REACT_APP_API_URL = xx.xxx.xxx.xxx" >.env
echo "REACT_APP_API_PORT = xxxx" >>.env
```

**Note:** These value point to our remote server. They will only work for a short time during testing.

## Run the App

```
yarn install
yarn start
```

You should see the **TrueBlocks Account Explorer** screen:

<img src="./public/screen_shot.png" />

## Searching for named addresses

- Click on the names module or menu item.
- In the `Search` box, enter `Vitalik` and double click on `Vitalik Buterin 2`.
- You should see the full transactional history of one of Vatilik's public accounts.
- Press the QuickBooks button at the bottom of the table to download these transactions.

## Try Your Own Address

- In the browsers URL bar, replace the existing address (0xab5801a7d398351b8be11c439e05c5b3259aec9b) with one of your own addresses.
- Replace the `name` parameter in the URL with your account's name.
- **Note:** editing the URL in this way is obviously temporary. In the actual app, you will be able to privately name your own accounts.
- You should see the entire history of your own address.
- You may export it and import it into your accounting software.

## That's it.

We have a lot of work to do, as you can see, but thanks for your help!
