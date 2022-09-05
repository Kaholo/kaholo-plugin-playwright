const kaholoPluginLibrary = require("@kaholo/plugin-library");

const playwrightService = require("./playwright-service");
const autocomplete = require("./autocomplete");

module.exports = kaholoPluginLibrary.bootstrap(
  {
    executeDotnetTest: playwrightService.executeDotnetTest,
  },
  {
    listDockerImageTagsAuto: autocomplete.listDockerImageTags,
  },
);
