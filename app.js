var express = require("express");
var cluster = require('cluster');
var hbs = require("hbs");

var articles = require("./articles");
var errors = require("./error");

var app = express();


app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.bodyParser());
app.use(express.static("public"));
app.disable('x-powered-by');

app.get("/", function(req, res){
	articles.getArticleList(function(err, entries){
		res.setHeader('Last-Modified', articles.getLastModified(entries));
		res.render("index", { title: "Localcraft", articles: entries, gotArticles: entries.length > 0 });
	});
});

app.get("/article/:url", function(req, res){
	articles.getArticleOnly(req.params.url + ".md", function(err, entry){
		if(err)
			err.errno == 34 ? errors.handle404(req, res) : errors.handle500(err, req, res, null);
		else{
			res.setHeader('Last-Modified', entry.lastModified);
			res.render("article", entry);
		}
	});
});

app.get("/tag/:tag", function(req, res){
	articles.getArticlesFromTag(req.params.tag, function(err, entries){
		if(err)
			errors.handle404(req, res);
		else{
			res.setHeader('Last-Modified', articles.getLastModified(entries));
			res.render("index", { title: "Search #" + req.params.tag, articles: entries, gotArticles: entries.length > 0 });
		}
	});
});

app.get(/\/(portfolio|about|contact)/i, function(req, res){
	res.render(req.params[0], { title: req.params[0] });
});

app.use(errors.handle404);
app.use(errors.handle500);

app.listen(80);

// express().use(express.vhost('localhost', app)).listen(80);