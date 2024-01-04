const cors = require('cors');

const whitelist = [process.env.FRONT_END_ORIGIN];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: req.header('Origin'),
      optionsSuccessStatus: 204,
      credentials: true,
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

const corsSetup = cors(corsOptionsDelegate);

module.exports = corsSetup;
