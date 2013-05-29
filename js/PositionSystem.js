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
function BasicPositionComponent(worldSize, startPosition){
	PositionComponent.call(this);
	// Now all ID setup manually, but later it must be automatically	
	this.COMPONENT_ID = 0    
	this.direction = [1, 1]
	this.worldSize = worldSize;	
	this.x = startPosition.x;
	this.y = startPosition.y;
	this.speed = Math.random() * 2 + 0.4;
}
extendObj(BasicPositionComponent, PositionComponent)

BasicPositionComponent.prototype.update = function(dt){
	
	this.checkBorderCollision()		
    this.x += this.speed * this.direction[0];    
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

/*
********************************************************************************
********************************************************************************
*/
function GameModelSystem(entityManager, worldSize){
	this.systemId = "GameModel"
	this.entityManager = entityManager
	this.posComponentFamilyID = (new PositionComponent()).getFamilyID();
	this.drawComponentFamilyID = (new RenderComponent()).getFamilyID();
	this.mainCharacterComponentFamilyID = (new MainCharacterComponent()).getFamilyID();
	this.animationComponentID = new AnimationComponent().getFamilyID()
	this.worldSize = worldSize
}

GameModelSystem.prototype.update = function(dt){
	var posComponentFamilyID = (new PositionComponent()).getFamilyID();	
	var entities = this.entityManager.getEntitiesWithComponent(posComponentFamilyID);	
			
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		// update position		
		var positionComponent = entity.getComponentByFamilyID(posComponentFamilyID);
		positionComponent.update();
		
		var animation = entity.getComponentByFamilyID(this.animationComponentID);

		if (typeof animation !== 'undefined'){
			animation.update(1)
		}
	}
}

GameModelSystem.prototype.draw = function(ctx, canvasSize){
	var entities = this.entityManager.getEntitiesWithComponent(this.posComponentFamilyID);	
	
	var lineY = 10
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.beginPath()
	ctx.moveTo(0, lineY);
	ctx.lineTo(canvasSize.width, lineY);
	ctx.stroke();
	
	
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		// update position		
		var positionComponent = entity.getComponentByFamilyID(this.posComponentFamilyID);
		var pos = positionComponent.getPos()	
		var relativeX = canvasSize.width * pos.x / this.worldSize.width;
		var mainCharacterComponent = entity.getComponentByFamilyID(this.mainCharacterComponentFamilyID);
				
		if ( typeof mainCharacterComponent === 'undefined'){
			drawCircle(ctx, relativeX, lineY,  "green")
		}
		else{
			drawCircle(ctx, relativeX, lineY,  "red")
		}		
	}	
}

function drawCircle(ctx, x, y, color){
	var radius = 2
	ctx.beginPath();		
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = color;
	ctx.stroke();
}
