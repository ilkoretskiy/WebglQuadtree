function ScreenSystem(entityManager, worldSize){
	this.systemId = "Screen"
	this.entityManager = entityManager
	this.textureComponentID = new TextureComponent().getFamilyID()	
	this.positionComponentID = new PositionComponent().getFamilyID()
	this.animationComponentID = new AnimationComponent().getFamilyID()
	this.foregroundComponentID = new ForegroundComponent().getFamilyID()
	this.mainCharacterComponentFamilyID = (new MainCharacterComponent()).getFamilyID();
	this.backgroundDecorComponentID = new BackgroundDecoratorComponent().getFamilyID();
	this.worldSize = worldSize
	
	
	this.VisibleSizeOfWorld = [100, this.worldSize.height];
	this.screenPos = [0, 0]
}


ScreenSystem.prototype.getVisiblePart = function(){
	return {
		"left" : this.screenPos[0],
		"top" : this.screenPos[1],
		"width" : this.VisibleSizeOfWorld[0],
		"height" : this.VisibleSizeOfWorld[1]
	}
}

ScreenSystem.prototype.update = function(){
	this.screenPos = [0, 0]
	var mainCharactersEntities = this.entityManager.getEntitiesWithComponent(this.mainCharacterComponentFamilyID);
	for (var i = 0; i < mainCharactersEntities.length; ++i)
	{
		var entity = mainCharactersEntities[i];
		var posComponent = entity.getComponentByFamilyID(this.positionComponentID);
		var pos = posComponent.getPos()
		this.screenPos[0] += pos.x;
		this.screenPos[1] += pos.y;
	}
	
	this.screenPos[0] -= this.VisibleSizeOfWorld[0] / 2 ;
}

ScreenSystem.prototype.draw = function(ctx, canvasSize){
	var spos = this.screenPos;
	
	this.drawBackgroundDecor(ctx, canvasSize);
	this.drawObjects(ctx, canvasSize, spos)
	this.drawForegroundDecor(ctx, canvasSize);
}

ScreenSystem.prototype.drawBackgroundDecor = function(ctx, canvasSize){
	var entities = this.entityManager.getEntitiesWithComponent(this.backgroundDecorComponentID);	
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		
		var bgDecorComp = entity.getComponentByFamilyID(this.backgroundDecorComponentID);			
		var pos = bgDecorComp.getPos();
		
		var textureComp = entity.getComponentByFamilyID(this.textureComponentID);	
		var texture = textureComp.getTexture();
		
		var dx = 0;
		var dy = 0;
		var animation = entity.getComponentByFamilyID(this.animationComponentID);
		
		if (typeof animation !== "undefined" ){
			// update mustn't be in draw function, but now it's ok
			animation.update(1)
			var shift = animation.getShift();			
			dx = shift.x;
			dy = shift.y;
		}
		
		ctx.drawImage(
			texture,
			dx + pos.x,
			dy + pos.y
		);
	}
}

ScreenSystem.prototype.drawObjects = function(ctx, canvasSize, spos){
	var entities = this.entityManager.getEntitiesWithComponent(this.positionComponentID);	
	// TODO draw all items in one loop and sort it by Z	
	for (var i = 0; i < entities.length; ++i){		
		var entity = entities[i];
		// update position		
		var positionComponent = entity.getComponentByFamilyID(this.positionComponentID);
		var pos = positionComponent.getPos()

		var textureComp = entity.getComponentByFamilyID(this.textureComponentID);	
		var texture = textureComp.getTexture();
			
		if (pos.x + texture.width >= spos[0] &&
			pos.x <= spos[0] + this.VisibleSizeOfWorld[0] &&
			pos.y + texture.height >= spos[1] &&
			pos.y <= spos[1] + this.VisibleSizeOfWorld[1])
		{
			
			var posRelatedToScreen = 
			{
				'x' : canvasSize.width * (pos.x - spos[0]) / (this.VisibleSizeOfWorld[0]),
				'y' : pos.y
			};

			var animation = entity.getComponentByFamilyID(this.animationComponentID);

			var dx = 0;
			var dy = 0;
			
			if (typeof animation !== "undefined" ){
				var shift = animation.getShift();
				dx = shift.x;
				dy = shift.y;
			}
			
			ctx.drawImage(
				texture,
				posRelatedToScreen.x + dx,
				posRelatedToScreen.y + dy
			);
		}
	}	
}

ScreenSystem.prototype.drawForegroundDecor = function(ctx, canvasSize){
	var entities = this.entityManager.getEntitiesWithComponent(this.foregroundComponentID);	
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		
		var foregroundComp = entity.getComponentByFamilyID(this.foregroundComponentID);			
		var pos = foregroundComp.getPos();
		
		var textureComp = entity.getComponentByFamilyID(this.textureComponentID);	
		var texture = textureComp.getTexture();
		
		var dx = 0;
		var dy = 0;
		var animation = entity.getComponentByFamilyID(this.animationComponentID);
		
		if (typeof animation !== "undefined" ){
			// update mustn't be in draw function, but now it's ok
			animation.update(1)
			var shift = animation.getShift();			
			dx = shift.x;
			dy = shift.y;
		}
		
		ctx.drawImage(
			texture,
			dx + pos.x,
			dy + pos.y
		);
	}
}
