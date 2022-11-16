const kaholoPluginLibrary = require("@kaholo/plugin-library");

const playwrightService = require("./playwright-service");

module.exports = kaholoPluginLibrary.bootstrap({
  executeDotnetTest: playwrightService.executeDotnetTest,
});
