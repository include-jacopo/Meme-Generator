'use strict';
/* Data Access Object (DAO) modulo per l'accesso agli utenti */

/* Struttura di 'memes.db':
 *     - images
 *     - meme_table
 *     - users
 */

const bcrypt = require('bcrypt');
const sqlite = require('sqlite3');
const db = new sqlite.Database('memes.db', (err) => {
    if (err) throw err;
}); 
  
//Ottenere un utente a partire da un ID
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {id: row.id, username: row.email, name: row.name}
          resolve(user);
        }
    });
  });
};

//Ottenere un utente a partire da email e password, per il login
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        }
        else {
          const user = {id: row.id, username: row.email, name: row.name};
          //Controllo gli hashes con una chiamata sync, dato che l'operazione può essere stressante per la CPU e non vogliamo bloccare il server
          bcrypt.compare(password, row.hash).then(result => {
            if(result) 
              resolve(user);
            else
              resolve(false);
          });
        }
    });
  });
};