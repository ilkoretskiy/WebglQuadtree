function Entity(){
    this.componentList = {};
    this.ID = -1
    this.componentsCount = 0
}


Entity.prototype.addComponent = function(component){
    this.componentList[component.FAMILY_ID] = component // i hope it will create a reference, not a copy
    this.componentsCount += 1
}

Entity.prototype.getComponents = function(){
    return this.componentList;
}

// I don't know how to get size of dict, because i implement this function
Entity.prototype.getComponentsCount = function(){
	return this.componentsCount;
}

Entity.prototype.getComponentByFamilyID = function(id){
	return this.componentList[id];
}

Entity.prototype.setID = function(id){
	this.ID = id
}

Entity.prototype.getID = function(){
	return this.ID
}
