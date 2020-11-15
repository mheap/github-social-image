#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .option("pat", {
    type: "string",
    description: "GitHub Personal Access Token",
  })
  .option("username", {
    type: "string",
    description: "GitHub Username",
  })

  .option("password", {
    type: "string",
    description: "GitHub Password",
  })

  .option("otp", {
    type: "string",
    description: "GitHub 2FA Code",
  })

  .option("target", {
    type: "string",
    description: "User/Org/Team to add social images for",
  })

  .option("theme", {
    type: "string",
    description: "Theme to use",
    default: "light",
  })
  .choices("theme", ["light", "dark"])

  .option("font", {
    type: "string",
    description: "font to use",
    default: "inter",
  })
  .choices("font", [
    "inter",
    "bitter",
    "raleway",
    "rokkitt",
    "source-code-pro",
    "koho",
  ])

  .option("background", {
    type: "string",
    description: "Background to use",
    default: "plus",
  })
  .choices("background", [
    "signal",
    "charlie-brown",
    "formal-invitation",
    "plus",
    "circuit-board",
    "overlapping-hexagons",
    "brick-wall",
    "floating-cogs",
    "diagonal-stripes",
  ])

  .option("logo", {
    type: "string",
    description: "URL to your logo",
  })

  .option("owner", {
    type: "boolean",
    default: true,
  })
  .option("language", {
    type: "boolean",
    default: true,
  })
  .option("stars", {
    type: "boolean",
    default: false,
  })
  .option("forks", {
    type: "boolean",
    default: false,
  })
  .option("issues", {
    type: "boolean",
    default: false,
  })
  .option("pulls", {
    type: "boolean",
    default: false,
  })

  .option("description", {
    type: "string",
    description: "Description to show",
  })

  .option("show", {
    type: "boolean",
    default: false,
    description: "Show puppeteer in the foreground",
  })

  .demandOption(["target"], "This can be the name of a user, org or team").argv;

(async function (argv) {
  require(".")(argv);
})(argv);
