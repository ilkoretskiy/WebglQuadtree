function TerrainComponent(){
	Component.call(this);
	this.FAMILY_ID = "TerrainComponent";
}
extendObj(TerrainComponent, Component);

//***********************************************************
function BarycentricTerrainComponent(gl, surface){
	TerrainComponent.call(this)
	this.COMPONENT_ID = "BarycentricTerrainComponent"
	this.surface = surface
	
	this.vertexBuffer  = gl.createBuffer();
	this.barycentricBuffer = gl.createBuffer();
	this.colorBuffer = gl.createBuffer();
	this.colors = []
	
	this.colormap = [];
	this.fillColormap(this.colormap);
	this.generateColors(surface.getSurface());
	
	this.vertexSize = 3 // x y z
	this.verticiesCount = surface.getSurface().length / this.vertexSize
	
	this.uploadBuffers(gl, surface);
}
extendObj(BarycentricTerrainComponent, TerrainComponent)


// TODO The same function as in Map2D. Move to some other place
BarycentricTerrainComponent.prototype.fillColormap = function(colormap){
	colormap.push(255); // blue
	colormap.push(0x964b00) // brown
	colormap.push(0x3d2b1f); // blue
	colormap.push(14527919) // brown
	colormap.push(0x964b00) // brown
	colormap.push(0x964b00); // red
}


// TODO The same function as in Map2D. Move to some other place
BarycentricTerrainComponent.prototype.getFromColormap = function(val){
	// val must be between 0 and 1
	var clVal = Clamp(val, 0, 0.999);
	return this.colormap[Math.floor((this.colormap.length) * clVal)];	
}

function R(color){
	return (color >> 16) & 0xFF
}

function G(color){
	return (color >> 8) & 0xFF
}

function B(color){
	return (color) & 0xFF
}

// TODO The same function as in Map2D. Move to some other place
BarycentricTerrainComponent.prototype.generateColors = function(surface){
	for (var i = 0 ; i < surface.length; i+=3){
		var z = surface[i + 2];
		var color = this.getFromColormap(z);
		
		this.colors.push(R(color) / 0xff);
		this.colors.push(G(color) / 0xff);
		this.colors.push(B(color) / 0xff);
		this.colors.push(255);			
	}
}

BarycentricTerrainComponent.prototype.uploadBuffers = function(gl, surface){
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surface.getSurface()), gl.DYNAMIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.barycentricBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surface.getBarycentric()), gl.DYNAMIC_DRAW);
		
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.DYNAMIC_DRAW);
}

BarycentricTerrainComponent.prototype.draw = function(shaderProgram, gl){		
	var uColor = gl.getUniformLocation(shaderProgram.program, "uColor");	
	gl.uniform4fv(uColor, [0., .5, 0., 1.]);
	
	var aVertex = shaderProgram.getVertex();
	gl.enableVertexAttribArray(aVertex);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);
	
	
	var aBarycentric = shaderProgram.getAttr("aBarycentric");
	gl.enableVertexAttribArray(aBarycentric);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.barycentricBuffer);
	gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
	
	
	var aColor = shaderProgram.getAttr("aColor");
	gl.enableVertexAttribArray(aColor);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, this.verticiesCount);

	gl.disableVertexAttribArray(aBarycentric);
	gl.disableVertexAttribArray(aVertex);
}
