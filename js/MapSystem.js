// I have some problem with drawing over image in js, 
// so i decide to not keep generated map.
// or i can keep internal canvas. Look at paperjs

function MapSystem(entityManager, worldSize, mapImage)
{
	this.entityManager = entityManager;
	this.worldSize = worldSize;
	
	this.posCompID = (new PositionComponent()).getFamilyID();			
	this.generatedMapImage = mapImage
}



MapSystem.prototype.update = function(){
	// Generate map	
}

MapSystem.prototype.draw = function(ctx, canvasSize, generatedMap){
	// left top rigtht bottom
	var visibleRect = {'left' : 0., 'top' : 0., 'right' : 1., 'bottom' : 1.}; // in percent
	
	
	// TODO check this moment with situation, when size of canvas not equal size of world
	visibleRect.right = Math.max(1., this.worldSize.width/ canvasSize.width);//GetRatioVal(canvasSize.width, this.worldSize.width);
	visibleRect.bottom = Math.max(1., this.worldSize.height/ canvasSize.height);//GetRatioVal(canvasSize.height, this.worldSize.height);
	
	//console.log(visibleRect)
	
	this.drawMap(ctx, canvasSize, visibleRect, generatedMap);
	this.drawObjects(ctx, canvasSize, visibleRect);	
}


MapSystem.prototype.drawMap = function(ctx, canvasSize, visibleRect, generatedMap){		
	if (this.generatedMapImage == 0){
		//var width = Math.floor((visibleRect.right - visibleRect.left) * this.worldSize.width);
		//var height = Math.floor((visibleRect.bottom - visibleRect.top) * this.worldSize.height);
		
	}
	
	ctx.putImageData(this.generatedMapImage, 0, 0);	
	
	//ctx.fillRect
}
	
	
MapSystem.prototype.drawObjects = function(ctx, canvasSize, visibleRect){
	// Draw last generated map
	var entities = this.entityManager.getEntitiesWithComponent(this.posCompID);
	
	
	
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		
		var posComp = entity.getComponentByFamilyID(this.posCompID);
		
		var relativePos = new Point(posComp.x / this.worldSize.width, posComp.y / this.worldSize.height);
		if (pointInRect(relativePos, visibleRect))
		{	
			var posOnCanvas = new Point(relativePos.x * canvasSize.width, relativePos.y * canvasSize.height)
			this.drawObject(ctx, posOnCanvas, entity);
		}
	}
}
	
MapSystem.prototype.drawObject = function(ctx, pos, entity){
	drawCircle(ctx, pos.x, pos.y, "black")
	//entity.getComponentByFamilyID()
}

