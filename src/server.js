import express from 'express';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import db from 'sqlite';
import {readdirSync} from 'fs';

function pad(num) {
  while (num.length < 5) {
    num = '0' + num;
  }
  return num;
}

export function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const numberOfPhotos = readdirSync('./images').length;

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: false}));

  // parse application/json
  app.use(bodyParser.json());

  app.use('/images', express.static('images'));

  app.get('/', (req, res) => {
    let one = Math.floor((Math.random() * numberOfPhotos) + 1).toString();
    let two = Math.floor((Math.random() * numberOfPhotos) + 1).toString();

    while (two === one) {
      two = Math.floor((Math.random() * numberOfPhotos) + 1).toString();
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sústredko or not</title>
        </head>

        <style>
          html, body {
            height: 100%;
          }

          html {
            display: table;
            margin: auto;
          }

          body {
            display: table-cell;
            vertical-align: middle;
          }
        </style>

        <body>
          <div style="text-align: center;">
            <h1>Vyber lepšiu fotku!</h1>
          </div>
          <div>
            <form method="post" action="/vote">
              <input type="image" name="submit" src="/images/${pad(one)}.jpg" value=${one} alt="Submit" />
              <input type="image" name="submit" src="/images/${pad(two)}.jpg" value=${two} alt="Submit" />
            </form>
          </div>
        </body>
      </html>
    `)
  });

  app.post('/vote', async (req, res) => {
    const vote = req.body.submit;
    console.log('[', new Date().toLocaleString(), '] Incoming vote for photo ID', vote);

    if (!vote) {
      res.redirect('/');
      return;
    }

    const row = await db.get('SELECT * FROM photos WHERE id=$pictureID', {$pictureID: vote});

    if (!row) {
      await db.run('INSERT INTO photos(id, votes) VALUES($vote, 1)', {$vote: vote});
    } else {
      await db.run(
        'UPDATE photos SET votes = votes + 1 WHERE id=$pictureID',
        {$pictureID: vote}
      );

      console.log('[', new Date().toLocaleString(), '] Registered vote for photo ID', vote);
    }
    res.redirect('/');
  });

  Promise.resolve()
    // First, try connect to the database and update its schema to the latest version
    .then(() => db.open('./database.sqlite', {Promise}))
    .then(() => db.migrate({force: 'last'}))
    .catch(err => console.error(err.stack))
    // Finally, launch Node.js app
    .finally(() => app.listen(port, () => {
      console.log('Server started on port', port);
    }));
}
