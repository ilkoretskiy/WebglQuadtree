function Component(){
	this.FAMILY_ID = -1;
	this.COMPONENT_ID = -1;
}

Component.prototype.setFamilyID = function(id){
	this.FAMILY_ID = id;
}

Component.prototype.getFamilyID = function(){
	return this.FAMILY_ID;
}

Component.prototype.setComponentID = function(id){
	this.COMPONENT_ID = id;
}

Component.prototype.getComponentID = function(){
	return this.COMPONENT_ID;
}
