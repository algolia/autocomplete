let percyHealthCheck = require("@percy/cypress/task");

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", percyHealthCheck);
};