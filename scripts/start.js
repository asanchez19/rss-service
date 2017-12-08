const { HTTP } = require('..');
const { connectToMongo } = require('../src/services/mongodb');
const config = require('../config');
const serverConfig = require('../src/config');


(async () => {

  //let mongo = await connectToMongo(config.mongoUrl);
  let http = new HTTP({ config });
  await http.listen();

  console.log(`Servidor corriendo en ${config.httpHost}:${config.httpPort}`);

})()
  .catch((err) => {
    console.error('ERROR INICIANDO SERVICIO:', err);
  });
