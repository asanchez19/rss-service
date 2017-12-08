const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookie = require('cookie-parser');
const body = require('body-parser');
const { main } = require('../routes');

/*
* HTTP server class.
*/
exports.HTTP = class HTTP {


  /*
  * Class constructor.
  */
  constructor({ config } = {}) {
    this.config = config;
    this.app = null;
    this.server = null;
  }


  /*
  * Returns a promise which starts the server.
  */
  async listen() {

    if (this.server) return this;

    // Express configuration
    this.app = express();
    this.app.use(morgan('dev'))
    this.app.use(cookie())
    this.app.use(body.json())
    this.app.use(body.urlencoded({ extended: true }))
    this.app.use(cors())
    this.app.use(helmet())
    this.app.disable('x-powered-by')

    //Route configuration
    this.app.use('/', main)


    await new Promise((resolve) => {
      let { httpPort, httpHost } = this.config;
      this.server = this.app.listen(httpPort, httpHost, resolve);
      //Cron.initCronJobs();
    });
  }


  /*
  * Returns a promise which stops the server.
  */
  async close() {
    if (!this.server) return this;

    await new Promise((resolve) => {
      this.server.close(resolve);
      this.server = null;
      this.app = null;
    });
  }

}
