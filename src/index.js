function* walk(json) {
  if (!json) {
    return;
  }
  for (const key of Object.keys(json)) {
    const value = json[key];
    if (value == null) {
      continue;
    }
    if (typeof value !== "object") {
      yield { key, value: `${value}` };
      continue;
    }
    for (const step of walk(value)) {
      yield { key: `${key}_${step.key}`, value: step.value };
    }
  }
}

const KEY = "npm_config";

module.exports = {
  name: `plugin-env`,
  factory: (require) => ({
    hooks: {
      setupScriptEnvironment(project, processEnv) {
        const path = require("path");
        const fs = require("fs");
        const pathToPackageJSON = path.join(project.cwd, "package.json");
        const json = JSON.parse(
          fs.readFileSync(pathToPackageJSON, { encoding: "utf-8" })
        );

        // Unwanted fields
        delete json.author;
        delete json.contributors;
        delete json.repository;
        delete json.funding;
        delete json.license;
        delete json.readmeFilename;

        for (const step of walk(json)) {
          processEnv[`${KEY}_${step.key}`] = step.value;
        }

        const currentCmd = processEnv.npm_lifecycle_event;
        if (currentCmd) {
          try {
            processEnv["npm_lifecycle_script"] = json.scripts[currentCmd];
          } catch (e) {}
        }
      },
    },
  }),
};
