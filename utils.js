var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

exports.padZero = function(i){
	return i <= 9 ? '0' + i : i;
};

exports.formatDate = function(date){
	return date.getDate() + ". " + months[date.getMonth()] + " " + date.getFullYear();	
};