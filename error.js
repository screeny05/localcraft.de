exports.handle404 = function(req, res){
	res.status("404");
	res.render("err", { err: "404 &ndash; Not Found" });
};

exports.handle500 = function(err, req, res, next){
	res.status("500");
	res.render("err", { err: "500 &ndash; Internal Server Error", stack: err.stack });
	console.log(err);
};