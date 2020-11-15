const puppeteer = require("puppeteer");
const request = require("request");
const fs = require("fs");
const debug = require("debug")("gsi:browser");

const banner_filename = "./__gh_banner.png";

module.exports = async (auth, repos, imageOptions) => {
  debug("Launching Puppeteer");
  const browser = await puppeteer.launch({ headless: !imageOptions.show });
  const page = await browser.newPage();
  await login(auth, page);
  for (let repo of repos) {
    await downloadImage(repo, imageOptions, browser);
    await updateSocialImage(repo, page);
  }
  debug("Removing image cache");
  fs.unlinkSync(banner_filename);
  browser.close();
  debug("Complete");
};

async function login(auth, page) {
  debug("Logging in to GitHub");
  await page.goto("https://github.com/login");
  await page.type("#login_field", auth.username);
  await page.type("#password", auth.password);
  await page.click('[name="commit"]');

  if (auth.otp) {
    debug("Submitting OTP");
    await page.waitForSelector("#otp");
    await page.type("#otp", auth.otp);
    await page.click('[type="submit"]');
  } else {
    debug("No OTP detected");
  }

  await page.waitForNavigation();
}

function optionsToQuery(opts) {
  const qObj = {};

  const flags = ["language", "owner", "forks", "issues", "pulls"];
  for (let f of flags) {
    qObj[f] = opts[f] ? 1 : 0;
  }

  qObj.stargazers = opts.stars ? 1 : 0;

  // If description is provided
  if (opts.description !== undefined) {
    qObj.description = 1;
  }

  if (opts.description) {
    qObj.descriptionEditable = opts.description;
  }

  // Theme, Font and Background need mapping from kebab-case
  // to Title%20Case
  qObj.theme = mapArgs(opts.theme);
  qObj.background = mapArgs(opts.background);
  qObj.font = mapArgs(opts.font);

  // Build a query string
  let q = `?`;

  for (let k in qObj) {
    q += `&${k}=${qObj[k]}`;
  }

  return q;
}

function mapArgs(str) {
  return str
    .split("-")
    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join("%20");
}

async function downloadImage(repo, imageOptions, browser) {
  debug(`[${repo}] Downloading social image`);
  const query = optionsToQuery(imageOptions);
  const url = `https://socialify.git.ci/${repo}/image${query}`;

  const banner = await new Promise((resolve) => {
    request.get(url, function (err, response, body) {
      return resolve(body);
    });
  });

  debug(`[${repo}] Converting SVG to PNG`);
  var page = await browser.newPage();

  // These dimensions come from `viewBox` in the SVG
  await page.setViewport({ width: 640, height: 320 });
  await page.setContent(banner);

  var imageBuffer = await page.screenshot({
    type: "png",
  });
  fs.writeFileSync(banner_filename, imageBuffer);

  await page.close();
}

async function updateSocialImage(repo, page) {
  debug(`[${repo}] Setting social image`);
  await page.goto(`https://github.com/${repo}/settings`);

  await page.waitForSelector("input[type=file]");
  await page.waitForTimeout(1000);

  const input = await page.$("input[type=file]");
  await input.uploadFile(banner_filename);

  // Wait for the upload to complete
  debug(`Waiting for upload to complete: ${repo}`);
  await page.waitForSelector(".is-uploading");
  await page.waitForSelector(".is-default");
}
