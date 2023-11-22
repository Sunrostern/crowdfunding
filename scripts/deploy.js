// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = 'Token';
  const SYMBOL = 'TOK';
  const TOKENS_MAX = '1000000';
  const PRICE = hre.ethers.utils.parseUnits('0.025', 'ether');

  // Deploying the Token Contract.
  const TokenContractFactory = await hre.ethers.getContractFactory('Token');
  const TokenContract = await TokenContractFactory.deploy(NAME, SYMBOL, TOKENS_MAX);
  await TokenContract.deployed();
  console.log(`\nThe Token Contract deployed at ${TokenContract.address}.\n`);

  // Deploying the Crowdfunding Contract.
  const CrowdfundingContractFactory = await hre.ethers.getContractFactory('Crowdfunding');
  const CrowdfundingContract = await CrowdfundingContractFactory.deploy(TokenContract.address, PRICE, hre.ethers.utils.parseUnits(TOKENS_MAX, 'ether'));
  await CrowdfundingContract.deployed();
  console.log(`\nThe Crowdfunding Contract deployed at ${CrowdfundingContract.address}.\n`);

  // Seeding Tokens into the Crowdfunding Contract.
  const transaction = await TokenContract.transfer(CrowdfundingContract.address, hre.ethers.utils.parseUnits(TOKENS_MAX, 'ether'));
  await transaction.wait();
  console.log(`\nTokens seeded into the Crowdfunding Contract.\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
