import { Meme } from '../memes/Memes.js';

//Importo il CSS con le posizioni dei vari campi di testo, i colori ed i font
import "./MemeText.css";

//Funzione che si occupa di mostrare il testo dei meme.
//Si aiuta con il CSS grazie alle proprietà del meme.
function MemeText(props) {
    return (<>
        {props.meme.fields >= 1 ?
            <span className={`${props.images[props.meme.img].field1_img} ${props.meme.color} ${props.meme.font}`}>{props.meme.field1}</span>
            : <></>}
        {props.meme.fields >= 2 ?
            <span className={`${props.images[props.meme.img].field2_img} ${props.meme.color} ${props.meme.font}`}>{props.meme.field2}</span>
            : <></>}
        {props.meme.fields === 3 ?
            <span className={`${props.images[props.meme.img].field3_img} ${props.meme.color} ${props.meme.font}`}>{props.meme.field3}</span>
            : <></>}
    </>
    );
};

//Funzione sfruttata dal Carousel che posiziona i campi di testo per aiutare l'utente
//a capire dove verrano posizionati
function FieldPreview(props) {
    //dato che gli viene fornito solo l'indice dell'immagine, crea un meme temporaneo
    let dummyMeme = new Meme(null, props.imgId, "", "", "", "", props.images[props.imgId].fields_img, "Campo 1", "Campo 2", "Campo 3", "bianco", "");
    if(props.imgId === 3){ //mettere in OR tutti i meme per i quali il testo bianco non si leggerebbe
        dummyMeme.color = "nero"; }
    
    //Chiama quindi la solita funzione che si occupa di mostrare il testo
    return (
        <MemeText meme={dummyMeme} images={props.images}/>
    );
};

export { MemeText, FieldPreview };