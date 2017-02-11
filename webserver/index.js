const e = require("express"),
    app = e(),
	bodyParser = require("body-parser");
	ejs = require("ejs")
app.enable("trust proxy");
app.use(bodyParser.urlencoded({
	extended: true,
	parameterLimit: 10000,
	limit: "5mb"
}));
app.use(bodyParser.json({
	parameterLimit: 10000,
	limit: "5mb"
}));
app.set("json spaces", 2);

app.engine("ejs", ejs.renderFile);
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
app.get("/",(req,res) => {
    res.render("landing")
})
app.listen(8090, config.webserverip, () =>{
	console.log("Webserver is running.")
})