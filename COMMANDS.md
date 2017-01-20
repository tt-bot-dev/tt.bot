#How to add commands
1. Create a file in commands directory.
2. Paste into it this skeleton structure: ```
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