import { useState } from 'react';
import { Button } from 'react-bootstrap';
import InputPopup from './InputMemes.js';
import { Link } from 'react-router-dom';

//Funzione per l'aggiunta dei meme, bottone in basso a destra
function NewMemeButton(props) {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      {/* Se sono loggato posso aggiungere un meme, altrimenti mi riporta al login*/}
      {!props.user ? <Link to="/login"> 
        <Button size="lg" variant="primary" className="meme-btn-fixed-rb">
          <svg className="align-middle" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
          </svg>
        </Button> </Link>
        : <Button size="lg" variant="primary" className="meme-btn-fixed-rb" onClick={() => setModalShow(true)}>
          <svg className="align-middle" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
          </svg>
        </Button>}

      <InputPopup show={modalShow}
        onHide={() => setModalShow(false)}
        addMeme={props.addMeme}
        images={props.images}
        user={props.user} />
    </>
  );
};

export default NewMemeButton;