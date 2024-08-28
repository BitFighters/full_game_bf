var bunyan = require('bunyan');


const ANAKIN_LOGGER = bunyan.createLogger({
  name: "anakin-logs",
  streams: [
    { path: "logs/anakin_logs.log" },
    { stream: process.stdout, level: "info" },
  ],
});

export {ANAKIN_LOGGER};