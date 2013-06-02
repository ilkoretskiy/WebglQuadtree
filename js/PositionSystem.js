function PositionSystem(entityManager, worldSize){
	this.systemId = "GameModel"
	this.entityManager = entityManager
	this.posComponentFamilyID = (new PositionComponent()).getFamilyID();
	this.drawComponentFamilyID = (new RenderComponent()).getFamilyID();
	this.mainCharacterComponentFamilyID = (new MainCharacterComponent()).getFamilyID();
	this.animationComponentID = new AnimationComponent().getFamilyID()
	this.worldSize = worldSize
}

PositionSystem.prototype.update = function(dt){
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

PositionSystem.prototype.draw = function(ctx, canvasSize){
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
