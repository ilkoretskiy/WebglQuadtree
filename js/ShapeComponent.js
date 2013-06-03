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
}
extendObj(CubeShapeComponent, ShapeComponent);

CubeShapeComponent.prototype.generateSurface = function(gl){
	this.verticies.push.apply(verticies, [
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

	this.barycentric.push.apply(barycentric, [
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

CubeShapeComponent.prototype.draw = function(shaderProgram, gl){
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
