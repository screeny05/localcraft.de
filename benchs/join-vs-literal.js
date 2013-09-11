var test = ["Just some random string banned into a array.. noeeeeees!! D:"];

var benchJoin = function(){
	var r = test.join();
};

var benchLiteral = function(){
	var r = test[0];
};

var mid = 0;
var tests = 10000000;

for (var i = tests; i >= 0; i--) {
	var start = Date.now();
	benchJoin();
	var duration = Date.now() - start;
	mid += duration;
};

console.log("Join: " + mid / tests);


mid = 0;

for (var i = tests; i >= 0; i--) {
	var start = Date.now();
	benchLiteral();
	var duration = Date.now() - start;
	mid += duration;
};

console.log("Literal: " + mid / tests);

// Join is slightly slower than using a Literal:
//  Join:    0.0001241 op/s
//  Literal: 0.0000964 op/s