# Storage Client  [![Circle CI](https://circleci.com/gh/Rise-Vision/storage-client/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/storage-client/tree/master)
## Introduction

Storage provides the media library for the Rise Vision digital signage management application and a demonstration of it can be viewed here [http://storage.risevision.com/storage-full.html](http://storage.risevision.com/storage-full.html)

Storage client is the client side application for the [Storage Server](https://github.com/Rise-Vision/storage-server).  Together they make up the storage module which is part of the [Rise Vision](http://rva.risevision.com) digital signage management application.  

[Rise Vision](http://rva.risevision.com) runs on Google App Engine and as such requires Google App Engine to operate. It also uses Google Cloud Storage as a datastore.

Chrome is the only browser that is supported with this application and any other browser compatibility is not planned at this time.

## Built With

- NPM (node package manager)
- Angularjs
- Gulp
- Bower
- Karma and Mocha for testing

## Development 

### Local Development Environment Setup and Installation

#### Linux


* this will allow you to install the latest Nodejs and NPM version, run this to install:
```bash
sudo apt-get install nodejs
```

* use Git to clone the repo:
```bash
git clone https://github.com/Rise-Vision/storage-client.git
```

* cd into the repo directory
```bash
cd storage-client
```
* make sure to update the NPM registry to install all dependencies with the cmd:
```bash
npm config set registry http://registry.npmjs.org/
```

* from the root of the repo run this command to install all npm dependencies
```bash
npm install
```

* install Bower globally using the NPM install cmd:
```bash
sudo npm install bower -g
```

* run Bower install cmd (note: you may need to run this multiple times and make sure there are no errors in the Bower install):
```bash
bower install
```

* install the right Gulp version globally with this cmd:
```bash
sudo npm install gulp@3.6.0 -g
```

* configure Gulp using this cmd:
```bash
gulp config
```
* Go to "Run Client" section in readme to run the client server now.

#### Windows 

* Windows 8.1 is used in this example.
* go to [nodejs.org](http://nodejs.org) and hit the install button that downloads the installer for nodejs for your version of windows. run the installer
* in git bash run this cmd at where you want the repo to be cloned to locally:
```bash
git clone https://github.com/Rise-Vision/storage-client.git
```

* search windows for a program called "nodejs command prompt". If the program is found then Nodejs is installed correctly, open this program as an administrator.
* at the top of the command prompt should display the node version (0.10.31 at the time of this update)
* navigate to the directory where you cloned the Storage-Client repo and in the root of the repo run this cmd:
```bash
npm install
```
* NOTE: if you get an "Error: ENOENT, stat 'C:\Users\(profile name)\AppData\Roaming\npm' error then you need to go to that Roaming directory for your windows login profile and add the folder "npm".  This is experienced in Windows 8.1

* install bower globally using the NPM install cmd in the Nodejs command prompt:
```bash
npm install bower -g
```
* run Bower install cmd (note: you may need to run this multiple times and make sure there are no errors in the Bower install):
```bash
bower install
```

* install the right Gulp version globally with this cmd:
```bash
npm install gulp@3.6.0 -g
```

* configure Gulp using this cmd:
```bash
gulp config
```
* Go to "Run Client" section in readme to run the client server now.


### Run Client

* run the client application with this cmd (in Nodejs command prompt in windows or bash prompt in Linux):
```bash
npm run dev
```

* application is running on http://localhost:8000, application is only supported with the Chrome browser.
* click on the link for "storage-modal.html" in application and on this page make sure in Chrome console that there are no javascript errors and Angular loads the page correctly.  If there are errors then you need to run Bower install again until there are no errors.

### Dependencies

* **Gulp** - is used as a task runner. It lints, minifies files, etc.  
* **Bower** - is used as a package manager for javascript libraries and frameworks. All third-party javascript frameworks and libraries are listed as dependencies in the bower.json file.
* **NPM & Nodejs** - the node package manager is used in hand in hand with gulp to start a server to host the app and all the dependencies needed from using a node server. All these node dependencies are listed in the package.json file

### Testing Setup and Use

For unit testing (with file watching), run

```bash
gulp test
```

To run unit test for a single run, do
```bash
gulp test-ci
```

To run E2E testing, you'll need to supply a user and password in an environment variable.
```bash
E2E_USER=me@sample.com E2E_PASS=mypass npm run e2e
```

To run e2e tests against a local client, you need storage-server and storage-client running. An environment variable named LOCAL is needed, and it's value should be *--local*.
```bash
LOCAL=--local E2E_USER=me@sample.com E2E_PASS=mypass npm run e2e
```

Note that e2e testing requires [Chromedriver](http://chromedriver.storage.googleapis.com/index.html) available in your path.

In case of running the tests on Windows, it's important to have the directory **e2e-downloads/storage-client** created inside the default download directory of Chrome/Chromium. The environment variable HOME needs to be defined and it should point to that directory.

## Submitting Issues 

Issues should be reported in the github issue list at https://github.com/Rise-Vision/storage-client/issues  

Issues should be reported with the template format as follows:

**Reproduction Steps**
(list of steps)
1. step 1
2. step 2

**Expected Results**
(what you expected the steps to produce)

**Actual Results**
(what actually was produced by the app)

Screenshots are always helpful with issues. 


## Contributing

All contributions greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our community (http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it

### Languages

In order to support languages i18n needs to be added to this repository.  Please refer to our Suggested Contributions.

### Suggested Contributions

* Storage modal file url to clipboard - There should be some way to get the file url when storage ui is used from the full screen app. Maybe direct copy-to-clipboard via an icon pop up on hover over.

* Use proper angularjs modals for new folder and delete confirmation prompts. This application should use proper angularjs modals rather than prompts

* i18n Language Support

## Resources

If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/. 

**Facilitator**

[Tyler Johnson](https://github.com/tejohnso "Tyler Johnson")
