const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('SquareVerifier');
const zokratesProof = require("../zokrates/code/square/proof.json");

contract('TestSolnSquareVerifier', accounts => {
    describe('Testing SolnSquareVerifier', function () {
      beforeEach(async function () { 
        this.contract = await SolnSquareVerifier.new(SquareVerifier.address);
      });

      // Test if a new solution can be added for contract - SolnSquareVerifier
      it('should add new solutions', async function () { 

        let tx = await this.contract.addSolutions(1, accounts[1],
          ...Object.values(zokratesProof.proof), zokratesProof.inputs);

        let solutionVerifiedEvent = tx.logs[0].event;
        //let solutionAddedEvent = tx.logs[1].event;

        assert.equal(solutionVerifiedEvent, 'SolutionSubmitted', 'Invalid event emitted');
        //assert.equal(solutionAddedEvent, 'SolutionSubmitted', 'valid event emitted');
      });

      // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
      it('should mint tokens for contract', async function () { 

        await this.contract.addSolutions(1, accounts[1],
          ...Object.values(zokratesProof.proof), zokratesProof.inputs);

        let tx = await this.contract.mint(accounts[1], 1, {from: accounts[0]});

        let tokenTransferredEvent = tx.logs[0].event; // transferred == minted
        
        assert.equal(tokenTransferredEvent, 'Transfer', 'Invalid event emitted');
      });
  });
});

