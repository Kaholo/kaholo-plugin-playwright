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
    imageTag = "latest",
    additionalCommandArguments,
  } = params;

  const absoluteProjectPath = resolve(projectDirectoryPath);
  if (!await pathExists(absoluteProjectPath)) {
    throw new Error(`Path ${absoluteProjectPath} does not exist on agent`);
  }

  const fullImageName = `${IMAGE_REPOSITORY}/${IMAGE_NAME}:${imageTag}`;
  const dotnetCommand = (
    additionalCommandArguments ? `${DOTNET_TEST_COMMAND} ${additionalCommandArguments}` : DOTNET_TEST_COMMAND
  );
  const projectDirVolumeDefinition = docker.createVolumeDefinition(projectDirectoryPath);
  const environmentVariables = mapEnvironmentVariablesFromVolumeDefinitions([
    projectDirVolumeDefinition,
  ]);

  const dockerCommand = docker.buildDockerCommand({
    image: fullImageName,
    command: docker.sanitizeCommand(dotnetCommand),
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
