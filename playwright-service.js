const _ = require("lodash");
const childProcess = require("child_process");
const { promisify } = require("util");
const { docker } = require("@kaholo/plugin-library");

const { assertPathExistence } = require("./helpers");
const {
  IMAGE_NAME,
  IMAGE_REPOSITORY,
} = require("./consts.json");

const exec = promisify(childProcess.exec);

async function executeDotnetTest(params) {
  const {
    projectDirectoryPath,
    imageTag = "latest",
  } = params;

  const projectDirectoryExists = await assertPathExistence(projectDirectoryPath);
  if (!projectDirectoryExists) {
    throw new Error(`Path ${projectDirectoryPath} does not exist on agent`);
  }

  const fullImageName = `${IMAGE_REPOSITORY}/${IMAGE_NAME}:${imageTag}`;
  const dotnetCommand = "dotnet test";
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

  if (_.isEmpty(stdout) && !_.isEmpty(stderr)) {
    throw new Error(stderr);
  }
  if (!_.isEmpty(stdout) && !_.isEmpty(stderr)) {
    console.error(stderr);
    return stdout;
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
