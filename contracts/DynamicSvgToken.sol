// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract DynamicSvgToken is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenCounter;

  string[] palette;

  constructor() ERC721('Dynamic SVG Token', 'DST') {

    palette.push("blue");
    palette.push("red");
    palette.push("maroon");
    palette.push("black");
    palette.push("yellow");
    palette.push("orange");
    palette.push("purple");
    palette.push("gold");
    palette.push("lawngreen");
    palette.push("lightblue");
    palette.push("olive");
  }


  function mint(string memory _fsUrl) external {
    _tokenCounter.increment();

    uint256 newTokenId = _tokenCounter.current();

    _mint(msg.sender, newTokenId);

    _setTokenURI(newTokenId, bytes(_fsUrl));
  }

  // function _constructTokenURL(uint256 _tokenId, bytes memory _tokenData) internal returns(string memory) {
  //   string memory tokenId = string(abi.encodePacked(bytes32(_tokenId)));

  //   // NOTE: after deployment, space must be reserved by the allocator for the chain, for the contract address
  //   // 1. Start upload
  //   fileStorage.startUpload(tokenId, _tokenData.length);
  //   // 2. Upload chunk
  //   fileStorage.uploadChunk(tokenId, 0, _tokenData);
  //   // 3. Finish the upload 
  //   fileStorage.finishUpload(tokenId);

  //   return string(abi.encodePacked(
  //     fileStoragePrefix,
  //     abi.encodePacked(address(msg.sender)),
  //     "/",
  //     tokenId
  //   ));
  // }

  // function _constructTokenURI(uint256 tokenId) internal view returns (string memory) {
  //   string memory svg = _constructSVG(tokenId);
    
  //   string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "', name(),'", "description": "A dynamic SVG", "image_data": "', bytes(svg), '"}'))));
    
  //   return string(abi.encodePacked('data:application/json;base64,', json));
  // }

  function base64EncodedSVG(uint256 _randSeed) public view returns (string memory) {
    string memory svg = generateSVG(_randSeed);
    string memory image = Base64.encode(bytes(svg));

    return string(
      abi.encodePacked(
          "data:image/svg+xml;base64,",
          image
      )
    );
  }

  function generateSVG(uint _randSeed) internal view returns (string memory) {
    uint no = getRandomNumber();
    uint rnd10 = (_randSeed%10);
    string memory yo_svg = string(abi.encodePacked(
            "<svg height='1100' width='1100' xmlns='http://www.w3.org/2000/svg' version='1.1'> ",
            "<circle cx='",Strings.toString(no%(900-rnd10)),
            "' cy='",Strings.toString(no%(1000-rnd10)),
            "' r='",Strings.toString(no%(100-rnd10)),
            "' stroke='black' stroke-width='3' fill='", palette[no%10],"'/>",

            "<circle cx='",Strings.toString(no%(902-rnd10)),
            "' cy='",Strings.toString(no%(1002-rnd10)),
            "' r='",Strings.toString(no%(102-rnd10)),
            "' stroke='black' stroke-width='3' fill='", palette[no%8],"'/>",


            "<circle cx='",Strings.toString(no%(901-rnd10)),
            "' cy='",Strings.toString(no%(1001-rnd10)),
            "' r='",Strings.toString(no%(101-rnd10)),
            "' stroke='black' stroke-width='3' fill='", palette[no%5],"'/>",

            "</svg>"
        ));

    return yo_svg;
  }

  function getRandomNumber() public view returns (uint )
    {
        bytes32 res = getRandom();
        uint256 num = uint256(res);
        return num;
    }

  function getRandom() private view returns (bytes32 addr) {
      assembly {
          let freemem := mload(0x40)
          let start_addr := add(freemem, 0)
          if iszero(staticcall(gas(), 0x18, 0, 0, start_addr, 32)) {
              invalid()
          }
          addr := mload(freemem)
      }
  }
}
