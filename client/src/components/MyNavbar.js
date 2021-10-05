import { Nav, Navbar, Form } from 'react-bootstrap';
import { Logo } from './Icons.js';
import { LogoutButton, LoginButton } from './Login.js';

//Funzione che si occupa di mostare la Navbar con tasto di login o logout
function MyNavbar(props) {
  const { onLogOut, loggedIn, user } = props;

  return (
    <Navbar variant="dark" fixed="top" bg="primary" className="navbar-fixed">

      <Navbar.Brand href="/">
        <Logo />
        Politecnico dei Memes
      </Navbar.Brand>

      <Nav className="ml-auto">
        <Navbar.Text className="mx-2">
          {/* Se sono loggato mostro un messaggio di benvenuto*/}
          {user && user.name && `Benvenuto, ${user?.name}!`}
        </Navbar.Text>
        <Form inline className="mx-2">
          {loggedIn ? <LogoutButton logout={onLogOut} /> : <LoginButton />}
        </Form>
      </Nav>
      
    </Navbar>
  );
};

export default MyNavbar;