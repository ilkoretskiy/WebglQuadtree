// Draw background
function BackgroundSystem(entityManager, worldSize){
	this.systemId = "Background"
	this.entityManager = entityManager
	this.worldSize	= worldSize
	this.backgroundComponentId = new BackgroundComponent().getFamilyID()	
}

BackgroundSystem.prototype.update = function(dt){
	
}


BackgroundSystem.prototype.draw = function(ctx, canvasSize, visibleRect ){	
	var w = canvasSize.width
	var h = canvasSize.height
	
	// i expect that layers are sorted by z
	var entities = this.entityManager.getEntitiesWithComponent(this.backgroundComponentId);	
	
	//var posComp = entity.getComponentByFamilyID(this.positionComponentId);
	
	// ratio of visible
	var visiblePart = {
		'left' : clamp(visibleRect.left / this.worldSize.width, 0., 1.),
		'top' : clamp(visibleRect.top / this.worldSize.height, 0., 1.),
		'right' : clamp((visibleRect.left + visibleRect.width) / this.worldSize.width, 0, 1),
		'bottom' : clamp((visibleRect.top + visibleRect.height) / this.worldSize.height, 0, 1)
	};
	
	// all backgrounds is entities
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		var bgComp = entity.getComponentByFamilyID(this.backgroundComponentId);	
		
				
		var texture = bgComp.getTexture();
		
		var level = bgComp.getLevel()
		
		var left = clamp(texture.width * visiblePart.left, 0, texture.width);
		var right = clamp(texture.width * visiblePart.right, 0, texture.width );
		
		var tw = texture.width;
		var th = texture.height;				
		
		// make it repeated
		if (left + w > tw)
		{
			var diff = tw - left
			ctx.drawImage(texture, left, 0, diff, th, 0, 0, diff, h)
			ctx.drawImage(texture, 0, 0, w - diff, th, diff, 0, w - diff, h)
		}
		else
		{
			ctx.drawImage(texture, left, 0, w, th, 0, 0, w, h)
			
		}		
	}
}
