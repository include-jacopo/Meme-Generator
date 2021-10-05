'use strict';

const express = require('express');
const morgan = require('morgan'); //Logging middleware
const {check, validationResult} = require('express-validator'); //Validazione middleware
const passport = require('passport'); //Autenticazione middleware
const LocalStrategy = require('passport-local').Strategy; //Username and password per il login
const session = require('express-session'); //Abilita la sessione

const dao = require('./dao'); //Modulo per l'accesso al database dei meme
const userDao = require('./user-dao'); //Modulo per l'accesso al database degli utenti

/*** Set Up di Passport ***/
//Impostazione della strategia di login "username e password"
//impostando una funzione per verificare username e password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Password e/o username errati' });

      return done(null, user);
    })
  }
));

//Serializzazione e de-serializzazzione dell'utente (utente object <-> session)
//serializziamo l'id utente e lo memorizziamo nella sessione, rendendola molto piccola in questo modo
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Partendo dai dati nella sessione, estraggo l'utente corrente (loggato)
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); //Sarà disponibile in req.user
    }).catch(err => {
      done(err, null);
    });
});

//Inizializzazione di Express
const app = new express();
const port = 3001;

//Set-up del middlewares
app.use(morgan('dev'));
app.use(express.json());

//Attivazione del server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//Custom middleware: controlla se una determinata richiesta proviene da un utente autenticato
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

//Impostazione della sessione
app.use(session({
  //Per default, Passport utilizza un MemoryStore per tenere traccia delle sessioni
  secret: '- lorem ipsum dolor sit amet -',
  resave: false,
  saveUninitialized: false
}));

//Quindi, inizializza passport
app.use(passport.initialize());
app.use(passport.session());

/********************************
 * API PER LA GESTIONE DEI MEME *
 ********************************/

//GET di tutti i meme pubblici
app.get('/api/public_memes', async (req, res) => {
  try {
    const result = await dao.listPublicMemes();
    if(result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch(err) {
    res.status(500).end();
  }
});

//GET di tutti i meme, pubblici e privati
app.get('/api/all_memes', async (req, res) => {
  try {
    const result = await dao.listAllMemes();
    if(result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch(err) {
    res.status(500).end();
  }
});

//GET delle immagini di sfondo per i meme
app.get('/api/images_list', async (req, res) => {
  try {
    const result = await dao.listImages();
    if(result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch(err) {
    res.status(500).end();
  }
});

//POST di un nuovo meme
app.post('/api/all_memes', 
isLoggedIn, 
[
  check('creator').isInt(),
  check('creator_name').isLength({min: 1}),
  check('img').isInt(),
  check('title').isLength({ min: 1, max:160 }),      
  check('private').isBoolean(),
  check('fields').isInt({min: 1})
], 
async (req, res) => {
  const errors = validationResult(req); // format error message
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()}); // error message is a single string with all error joined together
  }
  const meme = {
    id: req.body.id,
    img: req.body.img,
    title: req.body.title,
    creator: req.user.id,
    creator_name: req.user.name,
    private: req.body.private,
    fields: req.body.fields,
    field1: req.body.field1,
    field2: req.body.field2,
    field3: req.body.field3,
    color: req.body.color,
    font: req.body.font
  };
  try {
    await dao.createMeme(meme);
    res.status(201).json(meme).end(); 
  } catch (err) {
    res.status(503).json({ error: `Errore del database durante la creazione di un nuovo meme: ${meme.id}.` }); 
  }
});

//DELETE di un meme a partire dall'ID
app.delete('/api/memes/:id', 
  isLoggedIn, 
  [ check('id').isInt() ], 
  async (req, res) => {
  try {
    await dao.deleteMeme(req.user.id, req.params.id);
    res.status(200).json({}); 
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}` });
  }
});

/************************************
 * API PER LA GESTIONE DEGLI UTENTI *
 ************************************/

//Login --> POST /sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      //Visualizza messaggio di accesso negato
      return res.status(401).json(info);
    }
    //Successo, esegui il login
    req.login(user, (err) => {
      if (err)
        return next(err);
      //req.user contiene l'utente autenticato, rimandiamo indietro tutte le info sull'utente
      //questo proviene da userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

//Logout --> DELETE /sessions/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

//GET /sessions/current
//controlla se l'utente è loggato o meno
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});
