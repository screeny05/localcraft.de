var fs = require("fs");
var md = require("marked");
var hljs = require("highlight.js");
var utils = require("./utils");

var articlePath = "./public/article";

md.setOptions({
	highlight: function(code, lang){
		if(lang)
			return hljs.highlight(lang, code).value;
		else
			return hljs.highlightAuto(code).value;
	},
	breaks: true,
	smartypants: true
});

var sortArray = function(array){
	array.sort(function(a, b){
		return a.publishedDate < b.publishedDate;
	});
	return array;
};

var quoteToHTML = function(entry){
	entry.showMore = false;
	entry.showMeta = false;

	var catchPos = entry.md.indexOf("<!-- from -->");
	var cite = entry.md.substr(0, catchPos);
	var auth = entry.md.substr(catchPos, entry.md.lenght);

	entry.catcher = '<blockquote class="quote">' + md(cite) + '</blockquote>' + md(auth);
	entry.html = entry.catcher;

	return entry;
};
var embedToHTML = function(entry){
	entry.showMore = false;
	entry.showMeta = false;

	return entry;
};
var mdToHTML = function(entry){
	var catchPos = entry.md.indexOf("<!-- more -->");
	entry.showMore = catchPos !== -1;
	entry.showMeta = true;
	if(entry.showMore){
		entry.catcher = md(entry.md.substr(0, catchPos));
		entry.html = md(entry.md);
	}
	else{
		entry.catcher = md(entry.md);
		entry.html = entry.catcher;
	}

	return entry;
};

// Last-Change-Header

exports.getArticleOnly = function(path, callback){
	var entry = {};
	entry.filename = articlePath + "/" + path;

	fs.readFile(entry.filename, "utf8", function(err, data){
		if(err)
			return callback(err, null);

		fs.stat(entry.filename, function(err, stats){
			data = data.replace("\r","");
			var splitted = data.split("\n");
		
			entry.urlname = path.slice(0, path.length - 3);
			entry.lastModified = stats.mtime;

			entry.title = splitted.splice(0, 1)[0].trim();
			entry.publishedDate = new Date(splitted.splice(0, 1)[0]);
			entry.published = utils.formatDate(entry.publishedDate);

			entry.tags = splitted.splice(0, 1)[0].trim().toLowerCase().split(", ");

			entry.md = splitted.slice(1).join("\n");

			switch(entry.title){
				case "Quote":
					entry = quoteToHTML(entry);
					break;
				case "Embed":
					entry = embedToHTML(entry);
					break;
				default:
					entry = mdToHTML(entry);
					break;
			}

			return callback(null, entry);
		});
	});
};

exports.getArticleList = function(callback, filterCallback){
	fs.readdir(articlePath, function(err, files){
		var list = [];

		var repeat = function(i){
			if(i < files.length){
				exports.getArticleOnly(files[i], function(err, entry){

					if(typeof filterCallback != "undefined"){
						if(filterCallback(entry)){
							list.push(entry)
						}
					} else {
						list.push(entry);
					}

					repeat(i + 1);
				});
			} else{
				callback(null, sortArray(list));
			}
		};
		repeat(0);
	});
};

exports.getArticlesFromTag = function(tag, callback){
	exports.getArticleList(callback, function(entry){
		return entry.tags.indexOf(tag) !== -1;
	});
};

exports.getLastModified = function(list){
	if(list.length == 0) return null;
	var ls = list[0].lastModified;
	for (var i = 1, l = list.length; i < l; i++) {
		if(list[i].lastModified > ls)
			ls = list[i].lastModified;
	};
	return ls;
};