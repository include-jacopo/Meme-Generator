import { useState } from 'react';
import { Table, Image } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { ClipboardPlus, InfoCircle, Trash } from 'react-bootstrap-icons';
import CopyPopup from './CopyMemes.js';
import InfoPopup from './InfoMemes.js';
import { MemeText } from './MemesPositions.js';

//Funzione che si occupa di mostrare la lista dei meme nella homepage
function MemeTable(props) {
    return (
        <Col>
            <Table className="d-flex justify-content-center">
                <tbody id="meme-table" align="center">
                    {props.memes.map(m =>
                        <MemeRow meme={m} key={m.id} images={props.images} addMeme={props.addMeme} deleteMeme={props.deleteMeme} user={props.user} />
                    )}
                </tbody>
            </Table>
        </Col>
    );
};

//Corpo della funzione MemeTable, si occupa di stampare il singolo meme con il suo testo ed i bottoni
function MemeRow(props) {
    const [modalShowCopy, setModalShowCopy] = useState(false);
    const [modalShowInfo, setModalShowInfo] = useState(false);

    return (<>
        <tr>
            <td className="memetable-col">

                {/* Stampa del template dell'immagine */}
                <MemePreview meme={props.meme} images={props.images} />

                <section className="d-flex justify-content-between mx-1 mt-2">

                    {/* Stampa del titolo dell'immagine */}
                    <div>{props.meme.title}</div>

                    <div>
                        {/* Se sono loggato posso eliminare un meme e mostrarne il bottone*/}
                        {props.user ? //un user dev'essere loggato prima di effettuare questi controlli
                            <>{props.user.id === props.meme.creator ?
                                <Trash className="mb-1" style={{ cursor: "pointer" }} onClick={() => props.deleteMeme(props.meme)} /> : <></>}</>
                            : <></>}

                        {/* Se sono loggato posso copiare un meme e mostrarne il bottone. Chiamo il componente che se ne occupa */}    
                        {props.user ? <ClipboardPlus className="ml-2 mb-1" style={{ cursor: "pointer" }} onClick={() => setModalShowCopy(true)} /> : <></>}
                        <CopyPopup show={modalShowCopy}
                            onHide={() => setModalShowCopy(false)}
                            meme={props.meme}
                            images={props.images}
                            addMeme={props.addMeme}
                            user={props.user}/>

                        {/* Bottone per visualizzare le info di un meme. Chiama il componente che se ne occupa */}    
                        <InfoCircle className="ml-2 mb-1" style={{ cursor: "pointer" }} onClick={() => setModalShowInfo(true)} />
                        <InfoPopup show={modalShowInfo}
                            onHide={() => setModalShowInfo(false)}
                            meme={props.meme}
                            images={props.images}
                            user={props.user}
                        />
                    </div>
                </section>
            </td>
        </tr>
    </>
    );
}

//Funzione per la stampa dell'immagine
function MemePreview(props) {
    //controllo che l'immagine stata gia' fetchata dalle API
    let img = props.images[props.meme.img]; 
    return (<>
        {img ? <section className="position-relative">
            <Image src={props.images[props.meme.img].path} rounded width={"500px"} />
            {/* Chiamo il componente che si occupa di stampare il testo del meme*/}
            <MemeText meme={props.meme} images={props.images} />
        </section> : <></>}
    </>);
};

export default MemeTable;
