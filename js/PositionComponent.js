function PositionComponent(){
	Component.call(this);
	this.FAMILY_ID = "PositionComponent"
	this.x = 0
    this.y = 0
}

extendObj(PositionComponent, Component)
	
PositionComponent.prototype.getPos = function(){
	return {
		'x':this.x, 
		'y':this.y
		}
}

/*
 ******************************************************
 ******************************************************
*/
function StaticPositionComponent(w, h){
	PositionComponent.call(this);
	// Now all ID setup manually, but later it must be automatically	
	this.COMPONENT_ID = 3
	this.w = w
	this.h = h
}
extendObj(StaticPositionComponent, PositionComponent)
	
StaticPositionComponent.prototype.update = function(dt){

}

/*
 ******************************************************
 ******************************************************
*/
function ManualPositionComponent(worldSize, startPosition){
	PositionComponent.call(this);
	// Now all ID setup manually, but later it must be automatically	
	this.COMPONENT_ID = 5    
	this.direction = [1, 1]
	this.worldSize = worldSize;	
	this.x = startPosition.x;
	this.y = startPosition.y;
	this.speed = Math.random() * 2 + 0.4;
}

extendObj(ManualPositionComponent, PositionComponent);

ManualPositionComponent.prototype.update = function(dt){
}

ManualPositionComponent.prototype.setPos = function(x, y){
	this.x = x;
	this.y = y;
	this.checkBorderCollision()
}

ManualPositionComponent.prototype.checkBorderCollision = function(){	
	if (this.x > this.worldSize.width)
	{		
		//this.x = this.worldSize.width
		this.x = 0
	}
	else if(this.x < 0)
	{
		this.x = this.worldSize.width	
	}
	
	if (this.y > this.worldSize.height)
	{
		this.y = this.worldSize.height
	}
	else if(this.y <= 0)
	{
		this.y = 0
	}
}

/*
 ******************************************************
 ******************************************************
*/
function BasicPositionComponent(worldSize, startPosition){
	PositionComponent.call(this);
	// Now all ID setup manually, but later it must be automatically	
	this.COMPONENT_ID = 0    
	this.direction = [-1, -1]
	this.worldSize = worldSize;	
	this.x = startPosition.x;
	this.y = startPosition.y;
	this.xspeed = Math.random() * 2 + 0.4;
	this.yspeed = Math.random() * 2 + 0.4;
	
	this.angle = 0;
	this.steeringRadius = 5
}
extendObj(BasicPositionComponent, PositionComponent)

BasicPositionComponent.prototype.update = function(dt){
	
	this.checkBorderCollision()		
    //this.x += (this.steeringRadius * Math.sin(this.angle * Math.PI / 360)  + this.xspeed) * this.direction[0];    
    //this.y += (this.steeringRadius * Math.cos(this.angle * Math.PI / 360)  + this.yspeed) * this.direction[1];
    
    this.x += (this.xspeed) * this.direction[0];
    this.y += (this.yspeed) * this.direction[1];
    
    this.angle = (this.angle + 1) % 360
}

BasicPositionComponent.prototype.checkBorderCollision = function(){	
	if (this.x > this.worldSize.width)
	{		
		this.direction[0] = -1
	}
	else if(this.x <= 0)
	{
		this.direction[0] = 1
	}
	
	if (this.y > this.worldSize.height)
	{
		this.direction[1] = -1
	}
	else if(this.y <= 0)
	{
		this.direction[1] = 1
	}
}

function gradToRad(grad){
	return grad * Math.PI / 180.
}

/*
 ******************************************************
 ******************************************************
*/
function RandomPositionComponent(){
    PositionComponent.call(this)
	this.COMPONENT_ID = 1
}
extendObj(RandomPositionComponent, PositionComponent)

RandomPositionComponent.prototype.update = function(){
    x = randomUpdate(x)
    y = randomUpdate(y)    
}

