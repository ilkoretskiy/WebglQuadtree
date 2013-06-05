function ShapeComponent(){
	Component.call(this)
	this.FAMILY_ID = "ShapeFamily";
	this.COMPONENT_ID = "ShapeComponent";
}

extendObj(ShapeComponent, Component)


function CubeShapeComponent(gl){
	ShapeComponent.call(this);
	this.COMPONENT_ID = "CubeShapeComponent";	
	
	this.vertexBuffer = gl.createBuffer();
	this.barycentricBuffer = gl.createBuffer();
	
	this.verticies = []
	this.barycentric = []
	this.generateSurface(gl);
	this.uploadBuffers(gl);
}
extendObj(CubeShapeComponent, ShapeComponent);

CubeShapeComponent.prototype.generateSurface = function(gl){
	this.verticies.push.apply(this.verticies, [
			-1.0, -1.0, 1.0,  1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
			-1.0, -1.0, 1.0, 1.0, 1.0, 1.0,	-1.0, 1.0, 1.0,
			-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
			-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
			-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
			-1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
			-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
			-1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
			1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
			1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
			-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
			-1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
		])

	this.barycentric.push.apply(this.barycentric, [
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0
		])
}

CubeShapeComponent.prototype.uploadBuffers = function(gl){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticies), gl.DYNAMIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.barycentricBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.barycentric), gl.DYNAMIC_DRAW);
}

CubeShapeComponent.prototype.draw = function(shaderProgram, gl){	
	var uColor = gl.getUniformLocation(shaderProgram.program, "uColor");			
	gl.uniform4fv(uColor, [.7, .7, .7, 1]);
	
	var aVertex = shaderProgram.getVertex()
	gl.enableVertexAttribArray(aVertex);	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);			
	gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);

	var aBarycentric = shaderProgram.getAttr("aBarycentric");
	gl.enableVertexAttribArray(aBarycentric);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.barycentricBuffer);			
	gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	gl.disableVertexAttribArray(aBarycentric);
	gl.disableVertexAttribArray(aVertex);
}
