'use strict';
/* Data Access Object (DAO) modulo per l'accesso ai meme */

/* Struttura di 'memes.db':
 *     - images
 *     - meme_table
 *     - users
 */

const sqlite = require('sqlite3');
const db = new sqlite.Database('memes.db', (err) => {
  if (err) throw err;
});

//Ritorna tutti i meme non protetti
exports.listPublicMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme_table WHERE meme_visibility = 0';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((e) => {
        return {
          id: e.meme_id, img: e.image_id, title: e.meme_title, creator: e.meme_creator,
          creator_name: e.meme_creator_name, isPrivate: Boolean(e.meme_visibility), fields: e.meme_fields,
          field1: e.field_1, field2: e.field_2, field3: e.field_3, color: e.color, font: e.font
        }
      });
      resolve(memes);
    });
  });
};

//Ritorna tutti i meme, pubblici e protetti
exports.listAllMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme_table';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((e) => {
        return {
          id: e.meme_id, img: e.image_id, title: e.meme_title, creator: e.meme_creator,
          creator_name: e.meme_creator_name, isPrivate: Boolean(e.meme_visibility), fields: e.meme_fields,
          field1: e.field_1, field2: e.field_2, field3: e.field_3, color: e.color, font: e.font
        }
      });
      resolve(memes);
    });
  });
};

//Aggiornamento del database con un nuovo meme
exports.createMeme = (meme) => {
  return new Promise((resolve, reject) => {

    //Ottengo l'ultimo id dei meme presenti e lo incremento di uno 
    db.get("SELECT MAX(meme_id)+1 AS id FROM meme_table", (err, row) => {
      if (err) {
        reject(err);
        return;
      };
      meme.id = row.id;

      //Eseguo l'inserimento nel database
      const sql = 'INSERT INTO meme_table (meme_id, image_id, meme_title, meme_creator, meme_creator_name, meme_visibility, meme_fields, field_1, field_2, field_3, color, font) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [meme.id, meme.img, meme.title, meme.creator, meme.creator_name, meme.private, meme.fields, meme.field1, meme.field2, meme.field3, meme.color, meme.font], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });

  });
};

//Eliminazione di un meme dal database
exports.deleteMeme = (user, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM meme_table WHERE meme_id = ? and meme_creator = ?';
    db.run(sql, [id, user], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

//Ritorna le proprietà delle immagini di sfondo dei meme
exports.listImages = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM images';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const images = rows.map((i) => {
        return { id: i.id, path: i.path, fields_img: i.fields_img, field1_img: i.field1_img, field2_img: i.field2_img, field3_img: i.field3_img }
      });
      resolve(images);
    });
  });
};