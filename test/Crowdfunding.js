const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};
const ether = tokens;

describe('Crowdfunding', () => {
  let accounts,
    CrowdfundingContract,
    deployer,
    TokenContract,
    user1;

  beforeEach(async () => {
    // Initializing Contract Factories.
    const CrowdfundingContractFactory = await ethers.getContractFactory('Crowdfunding');
    const TokenContractFactory = await ethers.getContractFactory('Token');

    // Deploying Contracts.
    TokenContract = await TokenContractFactory.deploy('Token', 'TOK', 1000000);
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user1 = accounts[1];
    CrowdfundingContract = await CrowdfundingContractFactory.deploy(TokenContract.address, ether(1), ether(1000000));

    // Seeding Tokens into the Crowdfunding Contract.
    let transaction = await TokenContract.connect(deployer).transfer(CrowdfundingContract.address, tokens(1000000));
    await transaction.wait();
  });

  describe('Deployment', () => {
    it('Returns Token price.', async () => {
      expect(await CrowdfundingContract.price()).to.equal(ether(1));
    });

    it('Returns the correct max Tokens.', async () => {
      expect(await CrowdfundingContract.maxTokens()).to.equal(ether(1000000));
    });

    it('Returns Token address.', async () => {
      expect(await CrowdfundingContract.token()).to.equal(TokenContract.address);
    });

    it('Seeds Tokens into the Crowdfunding Contract.', async () => {
      expect(await TokenContract.balanceOf(CrowdfundingContract.address)).to.equal(tokens(1000000));
    })
  });

  describe('Buying Tokens', () => {
    const amount = tokens(10);
    let result, transaction;
    describe('Success', () => {
      beforeEach(async () => {
        transaction = await CrowdfundingContract.connect(user1).buyTokens(amount, { value: ether(10) });
        result = await transaction.wait();
      });

      it('Transfers Tokens.', async () => {
        expect(await TokenContract.balanceOf(CrowdfundingContract.address)).to.equal(tokens(999990));
        expect(await TokenContract.balanceOf(user1.address)).to.equal(amount);
      });

      it('Updates Contract Ether balance.', async () => {
        expect(await ethers.provider.getBalance(CrowdfundingContract.address)).to.equal(amount);
      });

      it('Updates Tokens sold.', async () => {
        expect(await CrowdfundingContract.tokensSold()).to.equal(amount);
      });

      it('Emits a Buy Event.', async () => {
        await expect(transaction).to.emit(CrowdfundingContract, 'Buy').withArgs(amount, user1.address);
      });
    });

    describe('Failure', () => {
      it('Rejects insufficient Ethers.', async () => {
        await expect(CrowdfundingContract.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted;
      });
    });
  });

  describe('Sending Ethers', () => {
    const amount = ether(10);
    let result, transaction;

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await user1.sendTransaction({
          to: CrowdfundingContract.address,
          value: amount
        });
      });

      it('Updates Contract Ethers value.', async () => {
        expect(await ethers.provider.getBalance(CrowdfundingContract.address)).to.equal(amount);
      });

      it('Updates User Token balance.', async () => {
        expect(await TokenContract.balanceOf(user1.address)).to.equal(amount);
      });
    });
  });

  describe('Updating Price', () => {
    const price = ether(2);
    let result, transaction;

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await CrowdfundingContract.connect(deployer).setPrice(price);
        result = await transaction.wait();
      });

      it('Updates the price.', async () => {
        expect(await CrowdfundingContract.price()).to.equal(price);
      });
    });

    describe('Failure', () => {
      it('Prevents a non-Owner from setting price.', async () => {
        await expect(CrowdfundingContract.connect(user1).setPrice(price)).to.be.reverted;
      });
    });
  });

  describe('Finalizing Funding', () => {
    const amount = tokens(10);
    const value = ether(10);
    let result, transaction;

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await CrowdfundingContract.connect(user1).buyTokens(amount, {
          value
        });
        result = await transaction.wait();

        transaction = await CrowdfundingContract.connect(deployer).finalize();
        result = await transaction.wait();
      });

      it('Transfers the remaining Tokens to the Owner.', async () => {
        expect(await TokenContract.balanceOf(CrowdfundingContract.address)).to.equal(0);
        expect(await TokenContract.balanceOf(deployer.address)).to.equal(tokens(999990));
      });

      it('Transfers the remaining Ethers balance to the Owner.', async () => {
        expect(await ethers.provider.getBalance(CrowdfundingContract.address)).to.equal(0);
      });

      it('Emits a Finalize Event.', async () => {
        await expect(transaction).to.emit(CrowdfundingContract, 'Finalize').withArgs(amount, value);
      });
    });

    describe('Failure', () => {
      it('Prevents a non-Owner from finalizing the crowdfunding.', async () => {
        await expect(CrowdfundingContract.connect(user1).finalize()).to.be.reverted;
      });
    });
  });
});
