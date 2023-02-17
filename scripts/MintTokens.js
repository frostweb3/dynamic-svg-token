const DynamicSvgToken = require("./DynamicSvgToken");
// const fs = require('fs');
const { isSourceFile } = require("typescript");

const Filestorage = require('@skalenetwork/filestorage.js');
const Web3 = require('web3');
const web3Provider = new Web3.providers.HttpProvider(
    // "https://staging-v3.skalenodes.com/fs/staging-utter-unripe-menkar"
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
);
let web3 = new Web3(web3Provider);

const filestorage = new Filestorage(web3, true);


const crypto = require("crypto");

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function getSVGData() {
  const randSeed = `0x${Math.floor(Math.random() * 2**256).toString(16)}`;
  return await DynamicSvgToken.base64EncodedSVG(randSeed);
}

async function uploadFile() {
  // 0. generate the fsHash
  fsHash = crypto.randomBytes(16).toString('hex');;
  // 1. get the svg data ^ using the fsHash
  // console.log({fsHash});
  const svgData = Buffer.from(await getSVGData(fsHash), "utf-8");;
  // console.log({svgData});

  // 2. upload using fsHash and the data
  console.log([ process.env.ACCOUNT_ADDRESS,
    fsHash,
    svgData,
    process.env.PRIVATE_KEY]);
  await filestorage.uploadFile(
    process.env.ACCOUNT_ADDRESS,
    fsHash,
    svgData,
    process.env.PRIVATE_KEY
  );
  console.log('Uploaded file');
  return fsHash;

}
async function fetchFileStoragePath(fileName) {
  // 1. list the root directory for the account
  const address = process.env.ACCOUNT_ADDRESS;
  const storagePath = address.slice(2, address.length)
  const items = await filestorage.listDirectory(storagePath);
  // 2. filter the results based on isFile
  const files = items.filter((item) => (item.isFile));
  // 3. find the tokenId in the results
  // 4. return the storagePath for it
  const file = files.find((f) => (f.name == fileName && f.uploadingProgress == 100))
  // console.log({files});
  return file.storagePath.toLowerCase();
}
// fetchFileStoragePath('test.txt').then(sp => console.log(sp));




(async () => {
  await mintTokens();

  async function mintTokens() {
    try {
      //Initialize the HTML boilerplate
      let fileContent = '<html><head></head><body>';
      
      const initialNonce = await DynamicSvgToken.getTransactionCount();


      for (let idx = 0; idx < 2; idx++) {
        if (idx % 20 === 0 && idx > 0) {
          console.log("Sent", idx, "txs");
          await sleep(2000);
        }

        const fsHash = await uploadFile();
      
        let fsUrl = process.env.FILE_STORAGE_PREFIX + await fetchFileStoragePath(fsHash);
        // console.log({fsUrl});
        const nonce = initialNonce + idx;
        const receipt = DynamicSvgToken.mint(nonce, fsUrl);
        const response = await receipt;
        const details = await response.wait();
        const evt = details.logs[0];

        const tokenId = evt.topics[3];
        const tokenURI = await DynamicSvgToken.tokenURI(tokenId);

        //Create an image tag
        const image = `<h2>Token Id: ${tokenId}</h2><img src="${tokenURI}" />\n`;
        //Append image to file content
        fileContent += image;

      }
      console.log("100 txs sent to the SKALE chain!");
      console.log("Let's go to block explorer to see them");
      //Append the </body> and </html> tags
      fileContent += '</body></html>';
      
      // //Write file contents to the file
      fs.writeFile('result.html', fileContent, (err) => { if (err) throw err; })
      
      console.log('The resulting SVGs are to be viewed in `result.html`');
    } catch (err) {
      console.log("Looks like something went wrong!", err);
    }
  }
})();
