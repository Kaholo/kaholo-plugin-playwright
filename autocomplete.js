const { default: axios } = require("axios");

const {
  IMAGE_NAME,
  IMAGE_REPOSITORY,
} = require("./consts.json");

const TAGS_ENDPOINT = `https://${IMAGE_REPOSITORY}/v2/${IMAGE_NAME}/tags/list`;

async function listDockerImageTags(query) {
  const { data } = await axios({
    method: "GET",
    url: TAGS_ENDPOINT,
  });

  const autocompleteItems = data.tags.map((tagName) => ({
    id: tagName,
    value: tagName,
  }));

  if (!query) {
    return autocompleteItems;
  }

  const lowerCaseQuery = query.toLowerCase();
  return autocompleteItems.filter(({ value }) => value.toLowerCase().includes(lowerCaseQuery));
}

module.exports = {
  listDockerImageTags,
};
