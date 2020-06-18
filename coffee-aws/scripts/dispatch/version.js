const semverSatisfies = require("semver/functions/satisfies");
const { engines } = require("./package");
const version = engines.node;

export const checkVersion = () => {
  console.log(`Running ${process.version}, required ${version}`);
  if (!semverSatisfies(process.version, version)) {
    throw "node engine version not satisfied";
  }
};
