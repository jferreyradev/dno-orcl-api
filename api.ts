import { Hono } from 'npm:hono'
import { init, closePoolAndExit, dostuff, execsql } from './orcldb.ts'
import { cors } from 'hono/cors'

const app = new Hono()

// MongoDB connection
let dbConnect = false;

// Middleware to connect to MongoDB
app.use('/api/*', cors())
app.use('*', async (c, next) => {
  if (!dbConnect) {
    await init();
    dbConnect = true;
  }
  await next();
});

app.get('/api', async (c) => {
  await dostuff();
  return c.text('API Pruebas!');
});

app.get('/api/exec', async (c) => {
  const r = await execsql('SELECT * FROM USUARIO.TABTIPOLIQUIDACION');
  return c.json(r.rows);
});

app.get('/api/adis', async (c) => {
  const r = await execsql('SELECT * FROM USUARIO.LIQUIDACION WHERE IDTIPOLIQUIDACION = 5 and fechaemision = usuario.f_Activo and idgrupo = 1');
  return c.json(r.rows);
});

Deno.addSignalListener('SIGINT', async () => {
  console.log('interrupted!');
  await closePoolAndExit();
  Deno.exit();
});

Deno.serve(app.fetch);
