function System(){
    
}

System.prototype.update = function(){
	
}

function inherit(obj, from){
    obj.prototype = from
    obj.prototype.constructor = obj
}

