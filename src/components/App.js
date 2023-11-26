import { useEffect, useState } from 'react';
import Info from './Info';
import Navigation from './Navigation';
import Loading from './Loading';
import Progress from './Progress';
import { ethers } from 'ethers';
import { Container } from 'react-bootstrap';

// Application Binary Interfaces.
import CrowdfundingAbi from '../abis/Crowdfunding.json';
import TokenAbi from '../abis/Token.json';

// Configuration.
import config from '../config.json';

function App() {
  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Contract states.
  const [price, setPrice] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork()

    const CrowdfundingContract = new ethers.Contract(config[chainId].crowdfunding.address, CrowdfundingAbi, provider);
    console.log(CrowdfundingContract.address);
    const TokenContract = new ethers.Contract(config[chainId].token.address, TokenAbi, provider);
    console.log(TokenContract.address);

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    // Getting the account balance.
    const accountBalance = parseFloat(ethers.utils.formatUnits(await TokenContract.balanceOf(account), 18));
    setAccountBalance(accountBalance);

    const price = ethers.utils.formatUnits(await CrowdfundingContract.price(), 18);
    setPrice(price);
    const maxTokens = parseFloat(ethers.utils.formatUnits(await CrowdfundingContract.maxTokens(), 18));
    setMaxTokens(maxTokens);
    const tokensSold = parseFloat(ethers.utils.formatUnits(await CrowdfundingContract.tokensSold(), 18));
    setTokensSold(tokensSold);

    setIsLoading(false);
  }

  useEffect(() => {
    document.title = "Token Crowdfunding";
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation/>
      <h1 className='text-center my-4'>Token Crowdfunding</h1>
      {isLoading ? (
        <Loading/>
      ) : (
        <>
          <p className='text-center'><strong>Current Price:</strong> {price} Ethers (ETH)</p>
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
        </>
      )}
      
      <hr/>
      {account && (
        <Info account={account} accountBalance={accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
      )}
    </Container>
  );
}

export default App;
