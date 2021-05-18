pragma solidity ^0.5.1;


import "./ERC721MintableComplete.sol";
import "./SquareVerifier.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721MintableComplete {

SquareVerifier squareVerifier;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    //SquareVerifier private squareVerifier;

    //address verifierAddress, string memory name, string memory symbol
    constructor (address verifierAddress) ERC721MintableComplete("Propety token", "PRT") public {

        squareVerifier = SquareVerifier(verifierAddress);

    } 

    // TODO define a solutions struct that can hold an index & an address
    struct solution {
        uint256 index;
        address sender;
        bytes32 solutionKey;
        uint256 tokenId;
        bool exists;
    }

    // TODO define an array of the above struct
    solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) solutionSubmitted; 
    mapping(uint256 => uint256) tokenIdIndex;


    // TODO Create an event to emit when a solution is added
    event SolutionSubmitted(uint256 tokenId, address sender, bytes32 solutionKey);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolutions(uint256 _tokenId, address _sender, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {

        bytes32 solhash = keccak256(abi.encodePacked(a, b, c, input));
        //require(!solutionSubmitted[solhash], "Solution is unique");

        solutionSubmitted[solhash] = true;

        bool verified = squareVerifier.verifyTx(a, b, c, input);
        require(verified, "Solution could not be verified");

        uint256 _index = solutions.length;

        // index in solutions array, caller, solution key, exists status
        solutions.push(solution({
            index: _index, 
            sender: _sender, 
            solutionKey:solhash, 
            tokenId: _tokenId,
            exists: true}));
        
        //solutions.push(solution);


        // Map tokenId to added solution
        tokenIdIndex[_tokenId] = _index;
        

        emit SolutionSubmitted(_tokenId, _sender, solhash);
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint256 tokenId)  public returns (bool) {

        uint256 indexStatus = tokenIdIndex[tokenId];

        //require(solutions[indexStatus].exists == true, "Requires solution has been added for token");
    
        return super.mint(to, tokenId);
    }

}























  






















