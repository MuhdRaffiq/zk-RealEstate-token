var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721MintableComplete', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Property Token", "PRT", {from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1);
            await this.contract.mint(account_two, 2);
            await this.contract.mint(account_two, 3);
            await this.contract.mint(account_three, 4);
            await this.contract.mint(account_three, 5);
            await this.contract.mint(account_three, 6);
      });


        it('should return total supply', async function () { 

            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, 6, "Does not match to the total supply");
            
        })

        it('should get token balance', async function () { 
            
            let balance_of_two = await this.contract.balanceOf.call(account_two);
            let balance_of_three = await this.contract.balanceOf.call(account_three);
            assert.equal(balance_of_two, 2, "Does not match balance of 2");
            assert.equal(balance_of_three, 3, "Does not match balance of 3");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 

            let tokenURI = await this.contract.tokenURI.call(1);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Does not match with the given tokenURI");
        })

        it('should transfer token from one owner to another', async function () { 
            
            await this.contract.safeTransferFrom(account_two, account_three, 2, {from: account_two});
              let newOwner = await this.contract.ownerOf(2);
              assert.equal(newOwner, account_three, "Token not transferred");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Property Token", "PRT",{from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            let status = true;
            try {
                await this.contract.mint(account_three, 6, {from: account_two})
            } catch(e) {
                status =false;
            }

            assert.equal(status, false, "the status does not match")

        })

        it('should return contract owner', async function () { 
            
            let ownerContract = await this.contract.getOwner.call();
            assert.equal(ownerContract, account_one, "Contract owner does not match");
        })

    });
});