#How to add commands
1. Create a file in commands directory.
2. Paste into it this skeleton structure:
 ```js
module.exports = {
    exec: function(msg,args) {
        //code
        /*if (isO(msg)) {
            // if your category is 2, please include this block.
        }*/
    },
    category: 1, //can be either 1 or 2  or 3
    isCmd:true,
    description: "your desc", // can be omitted
    display:true, // can be either true or false and is optional
    name:"command name",
    args: "something" // can be ommited
    }
```

If you're going to do any moderator commands, please follow this command structure:
```js
module.exports = {
    exec: async function(msg,args) {
        if (await bot.isModerator(msg.member)) {
            //code
        }
    },
    category: 3, // has to be 3
    isCmd:true,
    description: "your desc", // can be omitted
    display:true, // can be either true or false and is optional
    name:"command name",
    args: "something" // can be ommited
    }
```
or this: 
```js
module.exports = {
    exec:function(msg,args) {
        bot.isModerator(msg.member).then(isMod =>{
            if (isMod) {
                //code
            }
        })
    },
    category: 3, // has to be 3
    isCmd:true,
    description: "your desc", // can be omitted
    display:true, // can be either true or false and is optional
    name:"command name",
    args: "something" // can be ommited
}
```