# github-social-image

CLI tool that uses the GitHub API, Puppeteer and [GitHub Socialify](https://socialify.git.ci/) to set the social image for all of your repos automatically.

![Example](https://repository-images.githubusercontent.com/313119473/b292d400-2786-11eb-99eb-bc728973d745)

## Installation

```bash
npm install -g github-social-image
```

## Usage

Authentication details can be provided in the environment or as CLI arguments

| Field     | Environment Variable | CLI option    |
| --------- | -------------------- | ------------- |
| API token | `GITHUB_TOKEN`       | `--pat `      |
| Username  | `GITHUB_USERNAME`    | `--username ` |
| Password  | `GITHUB_PASSWORD`    | `--password ` |
| OTP       | `GITHUB_OTP`         | `--otp `      |

```bash
github-social-image --target "your-user-name"
```

### Behaviour options

| Flag     | Description                                                                                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username | GitHub account username                                                                                                                                                     |
| password | GitHub account password                                                                                                                                                     |
| otp      | One Time Password code, required for accounts that use 2FA                                                                                                                  |
| pat      | Github API token, used to fetch a list of repos                                                                                                                             |
| target   | User, Org or Team to update the social image for. Will update all repos that the authenticated `pat` has admin access to. To specify a team, use the format `org/team-slug` |
| show     | Show the Puppeteer browser for debug purposes                                                                                                                               |

### Image related options

| Flag        | Description                                 | Default     | Possible values                                                                                                                  |
| ----------- | ------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| theme       | Theme to use                                | `light`     | light, dark                                                                                                                      |
| font        | Font to use                                 | `inter`     | inter, bitter, raleway, rokkitt, source-code-pro, koho                                                                           |
| background  | Background to use                           | `plus`      | signal, charlie-brown, formal-invitation, plus, circuit-board, overlapping-hexagons, brick-wall, floating-cogs, diagonal-stripes |
| logo        | Logo to use                                 | Github Logo | Any URL that returns an image                                                                                                    |
| language    | Show the language icon                      | `true`      | N/A                                                                                                                              |
| owner       | Show the owner in addition to the repo name | `true`      | N/A                                                                                                                              |
| stars       | Show the number of stars                    | `false`     | N/A                                                                                                                              |
| forks       | Show the number of forks                    | `false`     | N/A                                                                                                                              |
| issues      | Show the number of issues                   | `false`     | N/A                                                                                                                              |
| pulls       | Show the number of pulls                    | `false`     | N/A                                                                                                                              |
| description | Description to use                          | N/A         | Specify as `--description` to use the description from the repo, or `--description "Text Here" to use a custom description       |

## FAQ

### Why do you need an API token _and_ my username?

This tool uses the API token for listing repos to update through the API, and the username to drive a browser and log in to your account to set the social image as this operation is not available through the API
