import {Hono} from 'npm:hono'
import { init, closePoolAndExit, dostuff, execsql } from './orcldb.ts'

const app = new Hono()

// MongoDB connection
let dbConnect = false ;

// Middleware to connect to MongoDB
app.use("*", async (c, next) => {
    if (!dbConnect) {
      await init();
      dbConnect = true
    }
    return next();
  });

app.get('/', async (c) => {
    await dostuff()
  return c.text('API Pruebas!')
})

app.get('/exec', async (c)=>{
  const r = await execsql(`SELECT * FROM USUARIO.TABTIPOLIQUIDACION`)
  //(console.log(r.rows)
  return c.json(r.rows)
})

Deno.addSignalListener("SIGINT", async () => {
  console.log("interrupted!");
  await closePoolAndExit()
  Deno.exit();
});

Deno.serve(app.fetch)

//Deno.serve({port:8787}, app.fetch)
