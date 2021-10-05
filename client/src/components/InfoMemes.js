import { Modal, Row, Col, Button, Image } from 'react-bootstrap';
import { MemeText } from './MemesPositions.js';

//Funzione chiamata al click del bottone info 
function InfoPopup(props) {
    return (
        <Modal {...props} size="lg"
            aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InfoForm meme={props.meme} hide={props.onHide} images={props.images} user={props.user} />
            </Modal.Body>
        </Modal>
    );
};

//Corpo del modal chiamato da InfoPopup
function InfoForm(props) {
    return (<>
        <Row className="justify-content-center mb-4">
            <section className="position-relative">
                <Image src={props.images[props.meme.img].path} rounded fluid width={"500px"} />
                {/* MemeText e' la funzione che si occupa della stampa del testo sul meme*/}
                <MemeText meme={props.meme} images={props.images} />
            </section>
        </Row>

        {/* Se non sono loggato non vedrò tutte le informazioni possibili sul meme */}
        {props.user ? <> <Row>
            <Col>
                <Row>
                    <p className="mb-1 ml-4" style={{ color: 'grey' }} >Titolo</p>
                </Row>
                <Row>
                    <p className="ml-4">{props.meme.title}</p>
                </Row>
            </Col>
            <Col>
                <Row>
                    <p className="mb-1 ml-4" style={{ color: 'grey' }}>Creatore</p>
                </Row>
                <Row>
                    <p className="ml-4 mb-1">{props.meme.creator_name}</p>
                </Row>
            </Col>
            <Col>
            </Col>
        </Row>
            <hr className="ml-2 mr-2" />
            <Row>
                <Col>
                    <Row>
                        <p className="mb-1 mt-2 ml-4" style={{ color: 'grey' }} >Campo 1</p>
                    </Row>
                    <Row>
                        <p className="ml-4">{props.meme.field1}</p>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <p className="mb-1 mt-2 ml-4" style={{ color: 'grey' }}>Campo 2</p>
                    </Row>
                    <Row>
                        <p className="ml-4 mb-1">{props.meme.field2}</p>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <p className="mb-1 mt-2 ml-4" style={{ color: 'grey' }}>Campo 3</p>
                    </Row>
                    <Row>
                        <p className="ml-4 mb-1">{props.meme.field3}</p>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Row>
                        <p className="mb-1 mt-2 ml-4" style={{ color: 'grey' }}>Colore del testo</p>
                    </Row>
                    <Row>
                        <p className="ml-4 mb-1" style={{ textTransform: "capitalize" }}>{props.meme.color}</p>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <p className="mb-1 mt-2 ml-4" style={{ color: 'grey' }}>Font</p>
                    </Row>
                    <Row>
                        <p className="ml-4 mb-1" style={{ textTransform: "capitalize" }}>{props.meme.font}</p>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <p className="mb-1 mt-2 ml-4" style={{ color: 'grey' }}>Visibilità</p>
                    </Row>
                    <Row>
                        <p className="ml-4 mb-1">{props.meme.private ? "Protetto" : "Pubblico"}</p>
                    </Row>
                </Col>
            </Row> </>
            : <> <hr className="ml-2 mr-2" />
                <Row>
                    <Col>
                        <Row className="justify-content-center">
                            <p style={{ color: 'grey' }} >Titolo</p>
                        </Row>
                        <Row className="justify-content-center">
                            <p>{props.meme.title}</p>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="justify-content-center">
                            <p style={{ color: 'grey' }}>Creatore</p>
                        </Row>
                        <Row className="justify-content-center">
                            <p>{props.meme.creator_name}</p>
                        </Row>
                    </Col>
                </Row> </>}
        <Button className="float-right mr-3" onClick={props.hide} variant="primary" type="submit"> Chiudi </Button>
    </>
    );
};

export default InfoPopup;


