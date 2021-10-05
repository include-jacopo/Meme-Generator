import {Meme, Image_Template} from './memes/Memes.js'

//Restituisce un array con tutti i meme pubblici ricavati dal server
async function GET_PublicMemes() {
  let data = [];
  try {
    const res = await fetch('/api/public_memes', {method: 'GET'});
    if (!res.ok) {
      throw new Error(res.statusText); }
    data = await res.json();
  } catch (e) {
      throw new Error(e);
  }
  return data.map((m) => new Meme(...Object.values(m)));
} 

//Restituisce un array con tutti i meme pubblici e privati ricavati dal server
async function GET_AllMemes() {
  let data = [];
  try {
    const res = await fetch('/api/all_memes', {method: 'GET'});
    if (!res.ok) {
      throw new Error(res.statusText); }
    data = await res.json();
  } catch (e) {
      throw new Error(e);
  }
  return data.map((m) => new Meme(...Object.values(m)));
} 

//Invia un nuovo meme al server per essere caricato nel db
async function POST_Meme(meme) {
  try {
    const res = await fetch('/api/all_memes', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(meme)
    });
    if (!res.ok) 
      throw new Error(res.statusText);
  } catch (e) {
    throw new Error(e);
  }
}

//Eliminazione di un meme dal database
function DELETE_Meme(meme) {
  return new Promise((resolve, reject) => {
    fetch(`/api/memes/${meme.id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        //Analizzo la causa dell'errore
        response.json()
          .then((message) => { reject(message); }) //Messaggio di errore nel response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); //qualcos'altro
        }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); //Errore di connessione
  });
}

//Restituisce un array con tutte le immagini di sfondo per i meme
async function GET_Images() {
  let data = [];
  try {
    const res = await fetch('/api/images_list', {method: 'GET'});
    if (!res.ok) {
      throw new Error(res.statusText); }
    data = await res.json();
  } catch (e) {
      throw new Error(e);
  }
  return data.map((i) => new Image_Template(...Object.values(i)));
} 

//Effettuare il login, date delle credenziali
async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

//Effettuare il logout della sessione corrente
async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

//Ottenere le informazioni dell'utente appena loggato
async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
  }
}

const API = {
    GET_PublicMemes, GET_AllMemes, POST_Meme, DELETE_Meme, GET_Images, logIn, logOut, getUserInfo
    };
  export default API;