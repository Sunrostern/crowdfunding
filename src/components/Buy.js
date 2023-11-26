import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

const Buy = ({ provider, price, crowdfunding, setIsLoading }) => {
  const [amount, setAmount] = useState('0');
  const [isWaiting, setIsWaiting] = useState(false);

  const buyHandler = async (e) => {
    e.preventDefault();
    setIsWaiting(true);

    try {
      const signer = await provider.getSigner();
      const value = ethers.utils.parseUnits((amount * price).toString(), 'ether');
      const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether');
      const transaction = await crowdfunding.connect(signer).buyTokens(formattedAmount, { value });
      await transaction.wait(); 
    } catch {
      window.alert(`Transaction reverted.`);
    }
    setIsLoading(true);
  }

  return (
    <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
        <Col>
          <Form.Control type='number' placeholder='Enter Amount' onChange={(e) => setAmount(e.target.value)}/>
        </Col>
        <Col className='text-center'>
          { isWaiting ? (
            <Spinner animation='border'/>
          ) : (
            <Button type = 'submit' variant = 'primary' style = {{ width: '100%' }}>
              Buy Tokens (TOK)
            </Button>
          )}
        </Col>
      </Form.Group>
    </Form>
  )
}

export default Buy;