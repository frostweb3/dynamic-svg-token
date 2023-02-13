require('dotenv').config()
const { ethers } = require('hardhat');

const abi = require("../abi/DynamicSvgToken-WithAddress.json");

async function mint(nonce) {
    const DynamicSvgToken = await ethers.getContractAt('DynamicSvgToken', abi.erc721_address);

    const res = DynamicSvgToken.mint({ nonce, gasLimit: 255000000 });
    return res;
}

async function tokenURI(tokenId) {

    const DynamicSvgToken = await ethers.getContractAt('DynamicSvgToken', abi.erc721_address);

    const res = DynamicSvgToken.tokenURI(tokenId);
    return res;
}

async function getTransactionCount() {
    const [ signer ] = await ethers.getSigners();
    let tx = await signer.getTransactionCount();
    return tx;
}

module.exports = {
    mint,
    getTransactionCount,
    tokenURI
};
