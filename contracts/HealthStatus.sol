pragma solidity ^0.6.6;

contract healthStatus {

    string ipfsHash;

    function uploadStatus(string memory _ipfsHash) public {
        ipfsHash = _ipfsHash; 
    }

    function getStatus() public view returns(string memory){
        return ipfsHash;
    }
}