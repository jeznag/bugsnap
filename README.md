# Introduction
This is Chrome extension that allows you to take page screenshots, annotate them and post directly to your bug tracker.

Supported trackers:

* Gemini
* Jira
* Rally
* Redmine
* YouTrack
* Mingle - very rough (http://screencast-o-matic.com/watch/coe6cAedF5)

FireFox version will be available later.

# Development

Setting environment and packaging:

1. Install nodejs
2. Install grunt (sudo npm install -g grunt-cli)
3. Navigate to bugsnap root folder and install modules (npm install)
4. Setup the environment (grunt install)
5. Package extensions (grunt)

Packaged extensions will appear in build folder.

Chrome extension can be tested directly by using "Load unpacked extension..."
button on Extensions page and pointing it to chrome directory.
