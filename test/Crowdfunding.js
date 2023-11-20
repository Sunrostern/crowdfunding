const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Crowdfunding', () => {
  let CrowdfundingContract

  beforeEach(async () => {
    const CrowdfundingContractFactory = await ethers.getContractFactory('Crowdfunding')
    CrowdfundingContract = await CrowdfundingContractFactory.deploy()
  })
  
  describe('Deployment', () => {
    it('Has a correct name.', async () => {
      expect(await CrowdfundingContract.name()).to.equal('Crowdfunding')
    })
  })
})
