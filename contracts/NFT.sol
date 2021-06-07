pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
contract NFT is ERC721{
uint public nextTokenId;
address public admin;

constructor() ERC721('My NFT','NFT'){
    admin = msg.sender;
}

function mint(address to)external{
    require(msg.sender == admin,'only admin can mint tokens');
    _safeMint(to, nextTokenId);
    nextTokenId++;
}

function _baseURI() pure internal override returns (string memory){
    return 'https://mighty-journey-50262.herokuapp.com/';
}

}