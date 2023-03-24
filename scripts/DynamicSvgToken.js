require('dotenv').config()
const { ethers } = require('hardhat');

const abi = require("../abi/DynamicSvgToken-WithAddress.json");

async function mint(nonce, fsUrl) {
    const DynamicSvgToken = await ethers.getContractAt('DynamicSvgToken', abi.erc721_address);
 
    const res = DynamicSvgToken.mint(fsUrl, { nonce, gasLimit: 255000000 });
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

async function base64EncodedSVG(fsHash) {
    const DynamicSvgToken = await ethers.getContractAt('DynamicSvgToken', abi.erc721_address);

    const res = await DynamicSvgToken.base64EncodedSVG(fsHash);
    return res;
}

module.exports = {
    mint,
    getTransactionCount,
    tokenURI,
    base64EncodedSVG,
    approve
};
