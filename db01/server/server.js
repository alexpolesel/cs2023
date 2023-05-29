import Fastify from "fastify";
import cors from "@fastify/cors";
import postgres from "@fastify/postgres";

import { nanoid } from "nanoid";
import bcrypt from 'bcrypt'

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client("167534645080-27cek59hke0d0n723cv2e80hphnom8tl.apps.googleusercontent.com")

const fastify = Fastify();
await fastify.register(cors, {});

// TODO:
// - restituire al client dati dell'utente una volta loggato

// IMPLEMENTATE MA DA RIFINIRE LATO CLIENT:
// - verifica passphrase lato client
// - implementare send dati homepage post login
// - visualizzazione dei profili
// - search button

fastify.register(postgres, {
  connectionString: `postgresql://postgres:password@localhost/postgres`,
});

// Call this function to validate the JWT credential sent from client-side
async function verifyToken(token) {
  client.setCredentials({ access_token: token })
  const userinfo = await client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });
  return userinfo.data
}

// Routes

// LOGIN
fastify.post("/login", (request, reply) => {
  verifyToken(request.body.token)
    .then((userInfo) => {
      fastify.pg.query(
        "SELECT * FROM users WHERE token = $1", [userInfo.sub],
        function onResult(err, result) {
          if (result.rows == 0) { // to register the user
            let id = nanoid(12);
            fastify.pg.query(
              "INSERT INTO users (user_id,token,name,picture) VALUES ($1, $2, $3, $4);",
              [id, userInfo.sub, userInfo.name, userInfo.picture],
              function onResult(err, result) {
                return { msg: err || result };
              })
          }
          else { // logging in
            reply.send(result.rows[0]);
          }
        }
      );

    })
    .catch((error) => {
      console.log(error)
    })
});

// INSERT PASTE
fastify.post("/NewPaste", (request, reply) => {
  fastify.pg.query(
    "SELECT * FROM users WHERE user_id=$1 AND token=$2;",
    [request.body.user_id, request.body.token],
    async function onResult(err, result) {
      if (result.rows != 0) { // authenticating
        let cryptedPass = "";
        if (request.body.passphrase) {
          cryptedPass = await bcrypt.hash(request.body.passphrase, 8)
        }
        let paste = {
          paste_id: nanoid(12),
          text: request.body.text,
          passphrase: cryptedPass,
          date: new Date(),
          language: request.body.language,
          user_id: request.body.user_id,
        };
        fastify.pg.query(
          "INSERT INTO pastes (paste_id, text, passphrase, date, language, user_id) VALUES ($1, $2, $3, $4, $5, $6);",
          [paste.paste_id, paste.text, paste.passphrase, paste.date, paste.language, paste.user_id],
          function onResult(err, result) {
            console.log(err)
            reply.send({ id: paste.paste_id })
          }
        );
      }
    }
  );
});

// QUERY PASTE
fastify.post("/pastes/:id", (request, reply) => {
  fastify.pg.query(
    "SELECT * FROM pastes WHERE paste_id=$1;",
    [request.params.id],
    async function onResult(err, result) {
      let queryPasteResult = result.rows[0];
      if (queryPasteResult != undefined) {
        if (queryPasteResult.passphrase) {
          if (request.body.passphrase == "") { // requesting passphrase
            reply.send({ secret: true })
          } else if (await bcrypt.compare(request.body.passphrase, queryPasteResult.passphrase) == false) {
            reply.send({ // if hashes doesn't match
              secret: true,
              wrong: true
            })
          }
        }
        // if hashes equals each other
        fastify.pg.query("SELECT * FROM users WHERE user_id=$1;", [queryPasteResult.user_id],
          function onResult(err, result) {
            let queryUserData = {
              user_id: result.rows[0].user_id,
              name: result.rows[0].name,
              picture: result.rows[0].picture
            };
            reply.send({
              userData: queryUserData,
              pasteData: queryPasteResult
            })
          })
      }
    }
  );
});

// TODO QUERY USER
fastify.post("/users/:id", async (request, reply) => {
  let queryUserPasteResult = [];
  queryUserPasteResult = await fastify.pg.query(
    "SELECT * FROM pastes WHERE user_id=$1;",
    [request.params.id]
  );
  let userInfo = await
    fastify.pg.query(
      "SELECT * FROM users WHERE user_id=$1;",
      [request.params.id]
    )

  reply.send({
    userPic: userInfo.rows[0].picture, userName: userInfo.rows[0].name, paste: queryUserPasteResult.rows
  });
});

await fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

