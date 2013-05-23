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


inherit(PositionComponent, Component)

function PositionComponent(){
	Component.call(this);
	this.FAMILY_ID = 0
	this.x = 0
    this.y = 0
}
	
inherit(BasicPositionComponent, PositionComponent)

function BasicPositionComponent(){
	PositionComponent.call(this);
	// Now all ID setup manually, but later it must be automatically	
	this.COMPONENT_ID = 0    
}

BasicPositionComponent.prototype.update = function(){
    this.x += 1
    this.y += 1
}

inherit(RandomPositionComponent, PositionComponent)

function RandomPositionComponent(){
    PositionComponent.call(this)
    this.FAMILY_ID = 0
	this.COMPONENT_ID = 1
}

RandomPositionComponent.prototype.update = function(){
    x = randomUpdate(x)
    y = randomUpdate(y)    
}

