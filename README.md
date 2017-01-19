# tt.alpha
[TTtie Bot](https://github.com/TTtie/TTtie-Bot), but with better code
It is actually made in [Eris](https://abal.moe/Eris).

#How to set up
1. Rename `exampleconfig.json` to `config.json`
2. Edit token, oid and optional, but if you need, dbotskey properties.
3. To modify the prefix, go to `[events/messageCreate.js](./events/messageCreate.js)` and modify lines 4 and 5; [how to](https://owo.whats-th.is/bcc386.gif)
4. Run `run.js`

#How to add commands/events
- Commands: 
    1. Create a file in commands directory.
    2. Paste into it this skeleton structure: ```js
    module.exports = {
    exec: function(msg,args) {
        //code
        /*if (isO(msg)) {
            // if your category is 2, please include this block.
        }*/
    },
    category: 1, //can be either 1 or 2 
    isCmd:true,
    description: "your desc", // can be omitted
    display:true, // can be either true or false and is optional
    name:"command name",
    args: "something" // can be ommited
    }
    ```
    3. Profit!
- Events: 
    1. Create a file same as the event name is (Get into Eris documentation.).
    2. Skeleton structure is : ```js
    module.exports = function(args) {
        //event handling
    }
    module.exports.isEvent = true;
    ```
    3. Profit.


# Development
As the name says, the bot is still in development. You can help recreating all [TTtie Bot](https://github.com/TTtie/TTtie-Bot) commands by submitting a pull request.