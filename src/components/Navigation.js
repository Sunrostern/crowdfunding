import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.png';

const Navigation = () => {
  return (
    <Container>
      <Navbar>
        <img
          src={logo}
          alt="Token Crowdfunding"
          height="40"
          width="40"
          className="d-inline-block align-top mx-3"
        />
        <Navbar.Brand href="#">Token Crowdfunding</Navbar.Brand>
      </Navbar>
    </Container>
  );
}

export default Navigation;
