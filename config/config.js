'use strict';

//load current configuration file accoring to the 'NODE_ENV' variable

module.exports = require('env/' + process.env.NODE_ENV + '.js');