const tracer = require("tracer");
let logger;
if (process.env.NODE_ENV === "dev") {
  logger = tracer.colorConsole({ level: 0 }); //en dev
} else if (process.env.NODE_ENV === " prod") {
  logger = tracer.console({ level: "warn" });
} else {
  // eslint-disable-next-line no-console
  console.error("NODE_ENV not set");
}

module.exports = logger || tracer.console({ level: 0 });
