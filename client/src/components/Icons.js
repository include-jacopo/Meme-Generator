import Image from 'react-bootstrap/Image'
import "./Icons.css";

function Logo(){
    //ritorna il logo a forma di doge con il cappello da laureato
    return(
        <Image id="doge" src="/logo.png"/>
    );
};

export {Logo};
