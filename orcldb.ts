import oracledb from "npm:oracledb@6.0.2";
export { oracledb };

let clientOpts = { libDir: "C:instantclient_21_10" };

oracledb.initOracleClient(clientOpts); // enable node-oracledb Thick mode

console.log(oracledb.thin ? "Running in thin mode" : "Running in thick mode");

async function init() {
    try {
     
      await oracledb.createPool({
        user: "workflow",
        password: "workflow",
        connectString: "10.6.177.180:1521/HPROD04",
      });
      console.log('Connection pool started');
  
    } catch (err) {
      console.error('init() error: ' + err.message);
    } finally {
      //await closePoolAndExit();
    }
  }
  
  async function dostuff() {
    let connection;
    try {
      // Get a connection from the default pool
      connection = await oracledb.getConnection();
      const sql = `SELECT CURRENT_DATE FROM dual WHERE :b = 1`;
      const binds = [1];
      const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
      const result = await connection.execute(sql, binds, options);
      console.log(result);      
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {         
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function execsql(sql, binds = {}) {
    let connection;
    try {
      // Get a connection from the default pool
      connection = await oracledb.getConnection();
      //const sql = `SELECT CURRENT_DATE FROM dual WHERE :b = 1`;
      //const binds = [1];
      const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
      console.log(sql)
      const result = await connection.execute(sql, binds, options);
      return result
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {         
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  
  async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
      await oracledb.getPool().close(10);
      console.log('Pool closed');
      process.exit(0);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }



  export {init, closePoolAndExit, dostuff, execsql }

  /*
  
  process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT',  closePoolAndExit);
  
  init();
  */