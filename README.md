Supplier Diagnostic
=================

To get started:
---------------

Ensure you have Node v5.4.0 installed. Use [nvm](https://github.com/creationix/nvm) to manage your versions.
cd into the root of the cloned repo.
Run the following command to install your dependencies:

    npm install -g cordova webpack webpack-dev-server

    npm install

Development:
------------

**Method 1:**
The fastest way to develop this app is to run the following command and navigate to [http://localhost:8000](http://localhost:8000) in your browser.
This will create an Express server and enable hot-module replacement to refresh changes automatically in the

    npm start

**Method 2:**
To output static assets into /www and watch for changes, run the following command:

    webpack --watch

(Run the above command without --watch to do a one-off build).


Development inc Cordova:
------------
Mac:

 - Have latest version of xCode
 - install android SDKs from:
 	- http://developer.android.com/sdk/installing/index.html?pkg=tools or `brew install android-sdk`,
 	- Make sure its saved in this location: `/usr/local/Cellar/android-sdk/` (homebrew will automatically save here).
 	- then set your path: add into your .bashrc/.bash_profile `export ANDROID_HOME=/usr/local/opt/android-sdk`
 	- look at http://developer.android.com/sdk/installing/adding-packages.html and also install the `Google Repository`, `google play services` and `android support repository` in extras.

Now:
------------
Run

     webpack #build local assets

     cordova platform add ios
     cordova platform add android
     cordova platform add browser //optional


then you can run the application with cordova also to emulate android on mac you have to create
andriod virtual device by running `/usr/local/Cellar/android-sdk/24.4.1_1/bin/android avd`
follow https://cordova.apache.org/docs/en/4.0.0/guide/platforms/android/

     cordova run browser
     cordova emulate ios
     cordova emulate android


---------------------------
Unit Testing:
------------
***Be sure your node_modules are up to date!***

To run the test:

```sh
npm test
```
now ensure when creating new files they follow this syntax otherwise the tests will not get picked up `{name}-test.js`

folder structure:

```
─┬ src
 ├─┬ components
 │ ├─┬ componentA
 │ │ ├── ComponentA-test.js
 │ │ └── ComponentA.js
 │ └─┬ ComponentB
 │   ├── ComponentB-test.js
 │   └── ComponentB.js
```
