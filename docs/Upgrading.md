# Upgrading
To upgrade your tt.bot, use either this command: 
```
[prefix]pull
```

or run this in your terminal/command prompt:
```
git pull --recurse-submodules
```

This will pull latest changes.

Now pull the latest dependencies:
```
npm i
```
> If you use Yarn, run this command instead:
> ```
> $ yarn
> ```

Some additional configuration might be needed. Compare `exampleconfig.js` and `config.js` and add the properties as needed.

Now, restart tt.bot. You should be greeted in with the new features.