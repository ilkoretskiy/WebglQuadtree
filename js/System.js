function System(){
    
}

System.prototype.update = function(){
	
}

// taken from http://davidshariff.com/blog/javascript-inheritance-patterns/#contact
var extendObj = function(childObj, parentObj) {
    var tmpObj = function () {}
    tmpObj.prototype = parentObj.prototype;
    childObj.prototype = new tmpObj();
    childObj.prototype.constructor = childObj;
};
