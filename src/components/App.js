import { useEffect, useState } from 'react';
import Info from './Info';
import Navigation from './Navigation';
import { ethers } from 'ethers';
import { Container } from 'react-bootstrap';

function App() {
  const [account, setAccount] = useState(null);
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  }

  useEffect(() => {
    document.title = "Token Crowdfunding";
    loadBlockchainData();
  });

  return(
    <Container>
      <Navigation/>
      <hr/>
      {account && (
        <Info account={account} />
      )}
    </Container>
  );
}

export default App;
