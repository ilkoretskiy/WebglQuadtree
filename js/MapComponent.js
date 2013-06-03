function MapComponent(){
	Component.call(this)
	this.FAMILY_ID = "MapComponent"
}

extendObj(MapComponent, Component)

function Map2DComponent(map){
	this.map = map
}

//**************************************************************

function Map2D(ctx, mapData, worldSize){
	this.colormap = [];		
	this.worldSize = worldSize;
	this.fillColormap(this.colormap);
	this.generatedImage = {};
	this.generateMapImage(ctx, mapData);	
	
}

Map2D.prototype.fillColormap = function(colormap){	
	colormap.push(255); // blue
	colormap.push(0x964b00) // brown
	colormap.push(0x3d2b1f); // blue
	colormap.push(14527919) // brown
	colormap.push(0x964b00) // brown
	colormap.push(0x964b00); // red	
}

Map2D.prototype.getFromColormap = function(val){
	// val must be between 0 and 1
	var clVal = Clamp(val, 0, 0.999);
	return this.colormap[Math.floor((this.colormap.length) * clVal)];	
}


Map2D.prototype.generateMapImage = function(ctx, mapData){
	var width = this.worldSize.width;
	var height = this.worldSize.height;
	this.generatedImage = ctx.createImageData(this.worldSize.width, this.worldSize.height);
	
	var pixelSize = 4; // 4 byte
	for (var row = 0; row < this.worldSize.height; ++row){
		for (var col = 0; col < this.worldSize.width; ++col){
			var idx = row * width * pixelSize + col * pixelSize;
			var color = this.getFromColormap(mapData[row][col]);	
			this.generatedImage.data[idx + 0] = (color >> 16) & 0xFF;
			this.generatedImage.data[idx + 1] = (color >> 8) & 0xFF;
			this.generatedImage.data[idx + 2] = (color) & 0xFF;
			this.generatedImage.data[idx + 3] = 255;
		}
	}
}

Map2D.prototype.getImage = function(){
	return this.generatedImage;
}

//**************************************************************
function Map3D(glctx, mapData, worldSize){
	this.worldSize = worldSize;
	this.generatedSurface = [];
	this.barycentric = [];
	this.generateSurface(mapData, this.generatedSurface, this.barycentric);
	this.normalizeSurface(this.generatedSurface);
}

Map3D.prototype.normalizeSurface = function(surface){
	for (var pointIdx = 0; pointIdx < surface.length; pointIdx += 3){
			surface[pointIdx] -= this.worldSize.width / 2;
			surface[pointIdx + 1] -= this.worldSize.height / 2;
	}
}

Map3D.prototype.generateSurface = function(mapData, verticies, barycentric){
	var z = 0;
	
	var halfRow = this.worldSize.height / 2.;
	var halfCol = this.worldSize.width / 2.;		
	var dx = 1;
	var dy = 1;
	
	for (var row = 0; row < this.worldSize.height; ++row){
		for (var col = 0; col < this.worldSize.width; ++col){				
			var nCol = col;
			var nRow = row;
			
			z = mapData[row][col];				
			
			var midPoint = [nCol + dx / 2., nRow + dy / 2., z];
							
			verticies.push.apply(verticies, midPoint)
			verticies.push.apply(verticies, [nCol, nRow, z])
			verticies.push.apply(verticies, [nCol + dx, nRow, z])
			
			verticies.push.apply(verticies, midPoint)
			verticies.push.apply(verticies, [nCol + dx, nRow, z])
			verticies.push.apply(verticies, [nCol + dx, nRow + dy, z])
		
			verticies.push.apply(verticies, midPoint)
			verticies.push.apply(verticies, [nCol + dx, nRow + dy, z])
			verticies.push.apply(verticies, [nCol, nRow + dy, z])

			verticies.push.apply(verticies, midPoint)
			verticies.push.apply(verticies, [nCol, nRow + dy, z])
			verticies.push.apply(verticies, [nCol, nRow, z])
			
			// i don't know how to repeat list like in python style
			barycentric.push.apply(barycentric, [
				1., 0., 0,
				0., 1., 0,
				0., 0., 1,
				
				1., 0., 0,
				0., 1., 0,
				0., 0., 1,
				
				1., 0., 0,
				0., 1., 0,
				0., 0., 1,
				
				1., 0., 0,
				0., 1., 0,
				0., 0., 1
			])
		}
	}
}	


Map3D.prototype.getSurface = function(){
	return this.generatedSurface;
}

Map3D.prototype.getBarycentric = function(){
	return this.barycentric;
}


