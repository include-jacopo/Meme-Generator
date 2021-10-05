import { Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Toast, Spinner } from 'react-bootstrap';
import MyNavbar from './components/MyNavbar.js'
import MemeTable from './components/MemeTable.js';
import NewMemeButton from './components/Buttons.js';
import { LoginForm } from './components/Login.js';
import API from './API.js';

/* CSS */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Main(props) {
  const [memeList, setMemeList] = useState([]);
  const [imgList, setImgList] = useState([]);
  const [memeListUpdated, setMemeListUpdated] = useState(true); //all'inizio la lista deve essere aggiornata

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const [loggedIn, setLoggedIn] = useState(false); //all'inizio, nessun utente è loggato
  const [user, setUser] = useState(null);

  //Controllo se un utente è autenticato
  useEffect(() => {
    const checkAuth = async () => {
      try {
        //Se è autenticato, qui ho le informazioni sull'utente
        const user = await API.getUserInfo();
        setUser(user); //aggiorno gli stati
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error); //loggo l'errore (soprattutto utente non autenticato)
      }
    };
    checkAuth();
  }, []);

  //Stampa dei meme per la prima volta, dopo una modifica al database o a login avvenuto
  useEffect(() => {
    //prima di chiamare le API avvio l'animazione di caricamento
    setLoading(true); 
    if (loggedIn) {
      //Se sono loggato recupero tutti i meme, setto il flag ed il caricamento a false
      API.GET_AllMemes()
        .then(memes => {
          setMemeList(memes);
          setMemeListUpdated(false);
          setLoading(false);
        }).catch(e => handleErrors(e));
    } else {
      //Se sono loggato recupero solo i meme pubblici, setto il flag ed il caricamento a false
      API.GET_PublicMemes()
        .then(memes => {
          setMemeList(memes);
          setMemeListUpdated(false);
          setLoading(false);
        }).catch(e => handleErrors(e));
    }
    //Recupero quindi tutte le immagini di sfondo per i meme
    API.GET_Images()
      .then(images => {
        setImgList(images);
      }).catch(e => handleErrors(e));
  }, [memeListUpdated, loggedIn]);

  //Aggiunta di un meme alla lista. Setta il flag memeListUpdated che aggiorna la lista dei meme.
  const addMeme = (meme) => {
    API.POST_Meme(meme)
      .then(() => setMemeListUpdated(true))
      .catch(e => handleErrors(e));
  }

  //Rimozione di un meme alla lista. Aggiorna il flag memeListUpdated che aggiorna la lista dei meme.
  const deleteMeme = (meme) => {
    API.DELETE_Meme(meme)
      .then(() => setMemeListUpdated(true))
      .catch(e => handleErrors(e))
  }

  //Gestione di eventuali errori in risposta alle API
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  }

  //Gestione del login per un utente. Setta l'oggetto utente e lo stato loggato.
  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    }
    catch (err) {
      throw err; //L'eventuale errore è gestito nel form di login
    }
  }

  //Gestione del logout. Svuota l'utente e nasconde i meme protetti
  const handleLogOut = async () => {
    await API.logOut()
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    setMemeList([]);
    setMemeListUpdated(true);
  }

  return (
    <>
      {/* Contenuto della pagina */}
      <Container fluid>

        {/* Navbar */}
        <MyNavbar onLogOut={handleLogOut} loggedIn={loggedIn} user={user} />

        {/* Visualizzazione di eventuali errori gestiti dalla funzione handleErrors*/}
        <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
          <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>

        <Switch>
          
          {/* Route per la pagina di login */}
          <Route path="/login">
            <Row className="vh-100 below-nav">
              {loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}
            </Row>
          </Route>

          {/* Route per l'homepage */}
          <Route path="/">
            <Row className="page">
              <Col as="main">

                {/* Stampa della lista dei meme o animazione di caricamento se necessaria */}
                {loading ? <Row className="justify-content-center mt-5">
                  <Spinner animation="border" size="xl" variant="primary" />
                </Row> :
                  <MemeTable memes={memeList} addMeme={addMeme} deleteMeme={deleteMeme} images={imgList} user={user} />}

                {/* Aggiunta di un nuovo meme */}
                <NewMemeButton addMeme={addMeme} images={imgList} user={user} />

              </Col>
            </Row>
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default Main;
