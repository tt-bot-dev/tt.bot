# Selfhosting guide for tt.bot v4.0.0
> If you want to upgrade instead, go [here][upgrading guide]
## Prerequisites
- Basic sysadmin knowledge
- [node.js], preferrably version 10 and above
- [Git]
- The database required to run the DB provider (officially supported is [RethinkDB])
- Tools required to build native node modules: check the [node-gyp] repository for more information; additional configuration might be required.
- [Yarn] (optional)
- A VPS or a spare machine if you want to run your bot 24/7

### 1. Get current source files
Run this command in your terminal/command prompt. Installing using the "download ZIP" feature is not supported.
```
$ git clone --recurse-submodules https://github.com/tt-bot-dev/tt.bot.git
```


### 2. Configure the bot
Copy `exampleconfig.js` and rename it to `config.js`.  
Then, fill out the required values. 

> If you wish to generate a random `encryptionIv`, run this command: `node .`

### 3. Install the dependencies and configure the database
First, make sure your database is running. We will need it.  
Then, run this in your terminal/command prompt.
```
$ npm i
```
> If you use Yarn, run this command instead:
> ```
> $ yarn
> ```

### 4. Run the bot
Run this in your terminal/command prompt.
```
$ node .
```
This will start up tt.bot.

[node.js]: https://nodejs.org
[Git]: https://git-scm.com
[Yarn]: https://yarnpkg.com
[RethinkDB]: https://rethinkdb.com
[node-gyp]: https://github.com/nodejs/node-gyp#installation
[upgrading guide]: ./Upgrading.md