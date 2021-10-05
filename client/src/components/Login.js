import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    //Validazione dei dati inseriti
    let valid = true;
    if (username === '' || password === '' || password.length < 6) {
      valid = false;
      setErrorMessage('Email non può essere vuota e la password deve essere di almeno 6 caratteri.');
      setShow(true);
    }

    if (valid) {
      props.login(credentials)
        .catch((err) => {
          console.log(err);
          setErrorMessage(err); setShow(true);
        })
    }
  };

  return (
    <Modal centered show animation={false} keyboard={false} backdrop="static">
    {/* Non permetto al modal di chiudersi cliccando sullo sfondo o usando il tasto esc*/}
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
          <Form.Group controlId="username">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/">
            <Button variant="secondary">Indietro</Button>
          </Link>

          <Button type="submit">Login</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

//Funzione per effettuare il logout
function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>Logout</Button>
  )
}

//Funzione che mi porta alla pagina di login
function LoginButton() {
  return (
    <Link to="/login">
      <Button variant="outline-light">Login</Button>
    </Link>
  )
}

export { LoginForm, LogoutButton, LoginButton };