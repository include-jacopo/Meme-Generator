import { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { Meme } from '../memes/Memes.js';
import { MemeText } from './MemesPositions.js';

//Funzione chiamata al click del tasto copia
function CopyPopup(props) {
  const { addMeme, ...rest } = props; //per il modal e' necessario esplicitare props in questo modo

  return (
    <Modal {...rest} size="lg"
      aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Copia il Meme
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CopyForm meme={props.meme} images={props.images} addMeme={addMeme} hide={props.onHide} user={props.user} />
      </Modal.Body>
    </Modal>
  );
};

//Corpo del modal chiamato da CopyPopup
function CopyForm(props) {
  const [title, setTitle] = useState(props.meme.title);
  const [pub, setPub] = useState(props.meme.private);
  const [field1, setField1] = useState(props.meme.field1);
  const [field2, setField2] = useState(props.meme.field2);
  const [field3, setField3] = useState(props.meme.field3);
  const [color, setColor] = useState(props.meme.color);
  const [font, setFont] = useState(props.meme.font);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); //Se ci sono errori 
    } else {
      // L'ID del meme viene settato dal server
      const newMeme = new Meme(null, props.meme.img, title, props.user.id, props.user.name, pub, props.meme.fields, field1, field2, field3, color, font);
      props.addMeme(newMeme); //Main si occuperà per l'aggiunta del meme
      props.hide(); //nascondo il modal
    }
  }

  //Validazione dei dati inseriti 
  const findFormErrors = () => {
    const newErrors = {}
    if (!title || title === '') newErrors.title = 'Non può essere vuoto';
    if (!field1 && !field2 && !field3) {
      newErrors.field1 = 'Non possono essere tutti vuoti';
      newErrors.field2 = 'Non possono essere tutti vuoti';
      newErrors.field3 = 'Non possono essere tutti vuoti';
    }
    return newErrors;
  }

  return (
    <Form>
      <Row className="justify-content-center mb-4">
        <section className="position-relative">
          <Image src={props.images[props.meme.img].path} rounded fluid width={"500px"} />
          {/* MemeText e' la funzione che si occupa della stampa del testo sul meme*/}
          <MemeText meme={props.meme} images={props.images}/>
        </section>
      </Row>

      <Row className="mx-1">
        <Col>
          <Form.Group controlId="formName">
            <Form.Label>Titolo </Form.Label>
            <Form.Control maxLength="55" type="text" defaultValue={title} onChange={e => setTitle(e.target.value)} isInvalid={!!errors.title} placeholder="Inserisci il titolo" />
            <Form.Control.Feedback type='invalid'> {errors.title} </Form.Control.Feedback>
          </Form.Group>

          <Col>
            <Row>
              <Col>
                <Row>
                  <Form.Label>Colore Font</Form.Label>
                </Row>
                <Row>
                  <Form.Control as="select" custom value={color} onChange={(e) => setColor(e.target.value)} >
                    <option value="bianco">Bianco</option>
                    <option value="nero">Nero</option>
                    <option value="rosso">Rosso</option>
                    <option value="verde">Verde</option>
                  </Form.Control>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Form.Label>Font</Form.Label>
                </Row>
                <Row>
                  <Form.Control as="select" custom value={font} onChange={(e) => setFont(e.target.value)} >
                    <option value="arial">Arial</option>
                    <option value="verdana">Verdana Corsivo</option>
                    <option value="impact">Impact</option>
                  </Form.Control>
                </Row>
              </Col>
            </Row>
          </Col>

          {/* Posso cambiare la visibilità di un meme protetto solo se sono io il creatore dello stesso*/}
          {props.meme.private && props.meme.creator !== props.user.id ? <></> :
            <Form.Group className="mt-4" controlId="formPublic">
              <Form.Check type="checkbox" checked={pub} onChange={e => setPub(e.target.checked)} label="Privato" />
            </Form.Group>}
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Campo di testo 1: </Form.Label>
            <Form.Control maxLength="70" className="mb-3" type="text" defaultValue={field1} onChange={e => setField1(e.target.value)} placeholder="Inserisci il campo 1" isInvalid={!!errors.field1} />
            <Form.Control.Feedback type='invalid'> {errors.field1} </Form.Control.Feedback>

            {/* Eseguo i controlli per sapere quanti campi di input mostrare */}
            {props.meme.fields >= 2 ? <>
              <Form.Label>Campo di testo 2: </Form.Label>
              <Form.Control maxLength="70" className="mb-3" type="text" defaultValue={field2} onChange={e => setField2(e.target.value)} placeholder="Inserisci il campo 2" isInvalid={!!errors.field2} />
              <Form.Control.Feedback type='invalid'> {errors.field2} </Form.Control.Feedback>
            </> : <></>}

            {props.meme.fields === 3 ? <>
              <Form.Label>Campo di testo 3: </Form.Label>
              <Form.Control maxLength="70" className="mb-3" type="text" defaultValue={field3} onChange={e => setField3(e.target.value)} placeholder="Inserisci il campo 3" isInvalid={!!errors.field3} />
              <Form.Control.Feedback type='invalid'> {errors.field3} </Form.Control.Feedback>
            </> : <></>}
          </Form.Group>
        </Col>

      </Row>

      <Button className="float-right" onClick={handleSubmit} variant="primary" type="submit"> Copia </Button>
    </Form>
  )
}
export default CopyPopup;