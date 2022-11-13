const childProcess = require("child_process");
const { promisify } = require("util");
const { resolve } = require("path");
const { docker } = require("@kaholo/plugin-library");

const { pathExists } = require("./helpers");
const {
  IMAGE_NAME,
  IMAGE_REPOSITORY,
  DOTNET_TEST_COMMAND,
} = require("./consts.json");

const exec = promisify(childProcess.exec);

async function executeDotnetTest(params) {
  const {
    projectDirectoryPath,
    additionalCommandArguments,
    imageTag,
  } = params;

  const absoluteProjectPath = resolve(projectDirectoryPath ? projectDirectoryPath : './');
  if (!await pathExists(absoluteProjectPath)) {
    throw new Error(`Path ${absoluteProjectPath} does not exist on agent`);
  }

  const fullImageName = `${IMAGE_REPOSITORY}/${IMAGE_NAME}:${imageTag ? imageTag : 'latest'}`;
  const commands = [
    "dotnet build &>/var/dotnet-build.log",
    "find ./ -name playwright.ps1 -exec pwsh {} install \\; &>/var/playwright-install.log",
    additionalCommandArguments ? `${DOTNET_TEST_COMMAND} ${additionalCommandArguments}` : DOTNET_TEST_COMMAND,
  ];
  const projectDirVolumeDefinition = docker.createVolumeDefinition(absoluteProjectPath);
  const environmentVariables = mapEnvironmentVariablesFromVolumeDefinitions([
    projectDirVolumeDefinition,
  ]);

  const dockerCommand = docker.buildDockerCommand({
    image: fullImageName,
    command: sanitizeCommand(commands.join("; ")),
    volumeDefinitionsArray: [projectDirVolumeDefinition],
    workingDirectory: `$${projectDirVolumeDefinition.mountPoint.name}`,
  });

  const { stdout, stderr } = await exec(dockerCommand, { env: environmentVariables });

  if (!stdout && stderr) {
    throw new Error(stderr);
  } else if (stderr) {
    console.error(stderr);
  }
  return stdout;
}

function sanitizeCommand(command) {
  return `bash -c ${JSON.stringify(command)}`;
}

function mapEnvironmentVariablesFromVolumeDefinitions(volumeDefinitions) {
  return volumeDefinitions.reduce((acc, cur) => ({
    ...acc,
    [cur.mountPoint.name]: cur.mountPoint.value,
    [cur.path.name]: cur.path.value,
  }), {});
}

module.exports = {
  executeDotnetTest,
};
