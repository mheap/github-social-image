let { Octokit } = require("@octokit/rest");
Octokit = Octokit.plugin(require("octokit-fetch-all-repos"));
const debug = require("debug")("gsi:entrypoint");

const browser = require("./browser");

module.exports = async function (argv) {
  // Set up auth
  const token = argv.token || process.env.GITHUB_TOKEN;
  const username = argv.username || process.env.GITHUB_USERNAME;
  const password = argv.password || process.env.GITHUB_PASSWORD;
  const otp = argv.otp || process.env.GITHUB_OTP;

  // Cache useful args
  const owner = argv.target;

  // Fetch list of repos
  const octokit = new Octokit({
    auth: token,
  });

  debug("Fetching repo list");
  const repos = await octokit.repos.fetchAll({
    owner,
    visibility: "public",
    minimum_access: "admin",
    include_forks: false,
    include_archived: false,
    include_templates: false,
  });

  debug("Triggering browser");
  await browser(
    { username, password, otp },
    repos.map((r) => r.full_name),
    argv
  );
};
