global.db = require("rethinkdb");
db.connect().then(conn =>{
    console.info("Connected to the database.");
    conn.use("ttalpha");
    global.dbConnection = conn;
}).catch(err=> {
    console.error("Can't connect to the database!");
    console.error(err);
    global.dbConnection = null;
})