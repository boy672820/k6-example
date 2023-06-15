import express, { Request, Response, NextFunction } from 'express';
import { getConnection } from './db';
import { generateUser, users, writeUserEndpoints } from './seed';
import { Schema } from './types';

const app = express();

app.get('/user', async (req: Request, res: Response) => {
  const connection = await getConnection();

  connection.query(
    'SELECT * FROM users ORDER BY user_id DESC LIMIT 1000',
    (err, results) => {
      if (err) {
        console.error('Error fetching users: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.send(results);
    }
  );

  connection.release();

  console.log('Done fetching users');
});

app.get('/user/latest', async (req: Request, res: Response) => {
  const connection = await getConnection();

  connection.query(
    'SELECT * FROM users ORDER BY user_id DESC LIMIT 1',
    (err, results) => {
      if (err) {
        console.error('Error fetching user: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (!results.length) {
        res.status(404).send('Not Found');
        return;
      }

      res.send(results[0]);
    }
  );

  connection.release();

  console.log('Done fetching latest user');
});

app.get('/user/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send('Bad Request');
    return;
  }

  const connection = await getConnection();

  connection.query(
    'SELECT * FROM users WHERE user_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error fetching user: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (!results.length) {
        res.status(404).send('Not Found');
        return;
      }

      res.send(results[0]);
    }
  );

  connection.release();

  console.log('Done fetching user: ', id);
});

// ---------------------------------------------------------------------------------------------------

app.post('/user', async (req: Request, res: Response) => {
  const connection = await getConnection();

  const { email, password, username, nickname, age, gender } = generateUser();

  const runQuery = () =>
    connection.query(
      'INSERT INTO users (email, password, username, nickname, age, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password, username, nickname, age, gender],
      (err) => {
        if (err) {
          // If we get a duplicate entry error, we try again
          if (err.code === 'ER_DUP_ENTRY') {
            runQuery();
            return;
          }
          console.error('Error inserting user: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        console.log('Done inserting user!');
        res.status(201).send('Created');
      }
    );

  runQuery();
  connection.release();
});

app.post('/user/bulk', async (req: Request, res: Response) => {
  const connection = await getConnection();

  const insertQuery = (user: Schema.User, tries = 0) => {
    const { email, password, username, nickname, age, gender } = user;

    connection.query(
      'INSERT INTO users (email, password, username, nickname, age, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password, username, nickname, age, gender],
      (err) => {
        if (err) {
          // If we get a duplicate entry error, we try again
          if (err.code === 'ER_DUP_ENTRY') {
            insertQuery(user, tries);
            return;
          }

          console.error('Error inserting user: ', err, ' But, we try again...');

          if (tries >= 3) {
            console.error('Too many tries, aborting...');
            return;
          }

          insertQuery(user, tries + 1);
        }
      }
    );
  };

  users.forEach((user) => {
    insertQuery(user);
  });

  connection.release();

  console.log('Done inserting users: ', users.length);

  res.status(201).send('Created');
});

app.post('/user/endpoints', (req: Request, res: Response) => {
  writeUserEndpoints().then(() => {
    res.send('Created');
  });
});

// ---------------------------------------------------------------------------------------------------

app.listen('3000', () => {
  console.log('Server listening on port: 3000');
});
