import {Hono} from 'npm:hono'
import { init, closePoolAndExit, dostuff } from './orcldb.ts'

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
  return c.text('Hello Hono!')
})

Deno.serve(app.fetch)

//Deno.serve({port:8787}, app.fetch)
