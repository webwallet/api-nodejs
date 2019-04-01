WebWallet API reference implementation in Node.js
=======================

[![Dependency Status](https://david-dm.org/webwallet/api/status.svg?style=flat)](https://david-dm.org/webwallet/api) 


This is an implementation in node.js along with neo4j and datastore
of the webwallet api reference.


Table of Contents
-----------------

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [List of Packages](#list-of-packages)

- [Deployment](#deployment)
- [Docker](#docker)


Prerequisites
-------------

- [Neo4j](https://neo4j.com/download/)
- [Node.js 8.0+](http://nodejs.org)
- [Google Datastore emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator)
- Command Line Tools
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17">&nbsp;**Mac OS X:** [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`)
 - <img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">&nbsp;**Windows:** [Visual Studio](https://www.visualstudio.com/products/visual-studio-community-vs) OR [Visaul Studio Code](https://code.visualstudio.com) + [Windows Subsystem for Linux - Ubuntu](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17">&nbsp;**Ubuntu** / <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_Linux_Mint.png" height="17">&nbsp;**Linux Mint:** `sudo apt-get install build-essential`
 - <img src="http://i1-news.softpedia-static.com/images/extra/LINUX/small/slw218news1.png" height="17">&nbsp;**Fedora**: `sudo dnf groupinstall "Development Tools"`
 - <img src="https://en.opensuse.org/images/b/be/Logo-geeko_head.png" height="17">&nbsp;**OpenSUSE:** `sudo zypper install --type pattern devel_basis`


Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/webwallet/api.git webwallet

# Change directory
cd webwallet

# Install NPM dependencies
npm install

# Then simply start your app
node index.js
```

**Note:** It is recommended to install [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node app.js` use `nodemon app.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon`.

Project Structure
-----------------
The project is structure using the [microapi library](https://github.com/jorgezaccaro/microapi),
this library add underneath the http paths to expose in a plug and play web service. Unlike express.js,
you don't to explicitly add every path and file in an initializer file. For instance the path 
for a POST to http://localhost:3000/transaction


| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **api/definitions**/               | Definitions used in the app.                                    |
| **api/middleware**/                | Middleware for microapi.                                    |
| **api/routes**/                    | Http routes for the api.                                    |
| **api/schemas**/                   | Joi schemas to validate the incoming bodies for every route.                                    |
| .dockerignore                      | Folder and files ignored by docker usage.                    |
| .env.example                       | Your API keys, tokens, passwords and database URI.           |
| .eslintrc                          | Rules for eslint linter.                                     |
| .gitignore                         | Folder and files ignored by git.                             |
| .travis.yml                        | Configuration files for continue integration.                |
| index.js                             | The main application file.                                   |
| docker-compose.yml                 | Docker compose configuration file.                           |
| Dockerfile                         | Docker configuration file.                                   |
| package.json                       | NPM dependencies.                                            |
| package-lock.json                  | Contains exact versions of NPM dependencies in package.json. |

**Note:** There is no preference how you name or structure your views.
You could place all your templates in a top-level `views` directory without
having a nested folder structure, if that makes things easier for you.
Just don't forget to update `extends ../layout`  and corresponding
`res.render()` paths in controllers.

List of Packages
----------------

| Package                         | Description                                                             |
| ------------------------------- | ------------------------------------------------------------------------|
| @webwallet/cryptools            | This library is used for all the cryptographic functions (key generations, signing, verifying,etc).                                                     |
| @webwallet/graphstore           | Library for querying and creating the representation of ious in the graph db neo4j.                         |
| @webwallet/hashtable            | Library for storing ious and transactions in google datastore |
| @webwallet/schemas              | Schemas defined using joi for validating the bodies of the http requests                                              |
| bignumber.js                    | Library for handling large numbers.                                     |
| bs58check                         | Library for checking .                             |
| dotenv                       | Loads environment variables from .env file.                                              |
| joi                     | Library for validating joi.                                         |
| json-stable-stringify                   | Library for generating uniform json stringfied objects.                                      |
| microapi                    | Library for routing http requests.                              |
| module-alias                          | Module for aliasing libs.                                                      |
| require-directory       | Require automating.                                         |

