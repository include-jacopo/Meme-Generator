import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Carousel, Image } from 'react-bootstrap';
import { Meme } from '../memes/Memes.js';
import { FieldPreview } from './MemesPositions.js';
import "./InputMemes.css";

function InputPopup(props) {
  const { addMeme, ...rest } = props; //per il modal e' necessario esplicitare props in questo modo

  return (
    <Modal {...rest} size="lg"
      aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Inserisci un nuovo Meme
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputForm images={props.images} addMeme={addMeme} hide={props.onHide} user={props.user} />
      </Modal.Body>
    </Modal>
  );
};

//Funzione chiamata dal corpo del modal per mostrare il carosello di immagini
function ImageCarousel(props) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    props.onSelectImage(selectedIndex); 
    //ritorno l'indice del Carousel corrispondente all'immagine al padre per sapere quale ho selezionato
  };

  return (
    <>
      <Carousel className="h-100" interval={null} activeIndex={index} onSelect={handleSelect}>
        {props.images && props.images.length > 0 ?
          props.images.map(i => <Carousel.Item key={i.id}>
            <section className="position-relative mx-0">
              <Image className={"d-block w-100"} src={i.path} rounded fluid />
              {/* Stampa sul meme della posizione dei campi dell'immagine*/}
              <FieldPreview imgId={index} images={props.images} />
            </section>
          </Carousel.Item>) : <></>}
      </Carousel>
    </>
  );
};

//Corpo del modal chiamato da CopyPopup
function InputForm(props) {
  const [imgChosen, setImgChosen] = useState(0);
  const [title, setTitle] = useState("");
  const [pub, setPub] = useState(false);
  const [fields, setFields] = useState(1);
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [color, setColor] = useState("bianco");
  const [font, setFont] = useState("arial");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    //al cambiamento dell'immagine tramite carosello, aggiorno il numero di campi di testo utilizzabili dal meme
    setFields(props.images[imgChosen].fields_img);
  }, [imgChosen, props.images]);

  const onSelectImage = (i) => {
    //aggiorno lo stato dell'indice dell'immagine scelta, ritornato dal figlio.
    setImgChosen(i)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); //controllo se ci sono errori
    } else {
      //l'ID del meme viene settato dal server
      const newMeme = new Meme(null, imgChosen, title, props.user.id, props.user.name, pub, fields, field1, field2, field3, color, font);
      props.addMeme(newMeme); //il main si occupa di aggiungere il meme alla lista
      props.hide();
    }
  }

  //Validazione per l'inserimento dei campi
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
      <Row className="justify-content-center mx-1">
        <Form.Group controlId="formImages">
          <ImageCarousel defaultValue={imgChosen} onSelectImage={onSelectImage} images={props.images} />
        </Form.Group>
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

          <Form.Group className="mt-4" controlId="formPublic">
            <Form.Check type="checkbox" checked={pub} onChange={e => setPub(e.target.checked)} label="Privato" />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Campo di testo 1: </Form.Label>
            <Form.Control className="mb-3" maxLength="70" type="text" defaultValue={field1} onChange={e => setField1(e.target.value)} placeholder="Inserisci il campo 1" isInvalid={!!errors.field1} />
            <Form.Control.Feedback type='invalid'> {errors.field1} </Form.Control.Feedback>

            {/* Eseguo i controlli per sapere quanti campi di input mostrare */}
            {fields >= 2 ? <>
              <Form.Label>Campo di testo 2: </Form.Label>
              <Form.Control className="mb-3" maxLength="70" type="text" defaultValue={field2} onChange={e => setField2(e.target.value)} placeholder="Inserisci il campo 2" isInvalid={!!errors.field2} />
              <Form.Control.Feedback type='invalid'> {errors.field2} </Form.Control.Feedback>
            </> : <></>}

            {fields === 3 ? <>
              <Form.Label>Campo di testo 3: </Form.Label>
              <Form.Control className="mb-3" maxLength="70" type="text" defaultValue={field3} onChange={e => setField3(e.target.value)} placeholder="Inserisci il campo 3" isInvalid={!!errors.field3} />
              <Form.Control.Feedback type='invalid'> {errors.field3} </Form.Control.Feedback>
            </> : <></>}
          </Form.Group>
        </Col>

      </Row>

      <Button className="float-right" onClick={handleSubmit} variant="primary" type="submit"> Crea </Button>
    </Form>
  )
}
export default InputPopup;