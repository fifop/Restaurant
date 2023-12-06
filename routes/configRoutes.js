const indexR = require("./index");
const usersR = require("./users");
const dishesR = require("./dishes");
const eventsR = require("./events");
const workerR = require("./worker");
// const autosR = require("./autos");
const passwordResetR = require("./passwordReset");



exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/dishes", dishesR);
  app.use("/worker", workerR);
  app.use("/events", eventsR);
  // app.use("/autos", autosR);
  app.use("/passwordReset", passwordResetR); 
  app.use("*", (req, res) => {
    res.status(404).json({ msg: "Page/endpoint not found, 404" })
  })
}
