function ShapeComponent{
}

ShapeComponent.prototype.preRender = function(){
}

ShapeComponent.prototype.applyBuffers = function(){
}

ShapeComponent.prototype.postRender = function(){
}
	
inherit(CubeShapeComponent, ShapeComponent)
function CubeShapeComponent{
    ShapeComponent.call(this)
    this._vertexBuffer = gl.createBuffer();

	this.generateArray = function(verticies){
		verticies.push.apply(verticies, [
			-1.0, -1.0, 1.0,
			1.0, -1.0, 1.0,
			1.0, 1.0, 1.0,
			
			-1.0, -1.0, 1.0,
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,
			
			-1.0, -1.0, -1.0,
			-1.0, 1.0, -1.0,
			1.0, 1.0, -1.0,
			
			-1.0, -1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, -1.0, -1.0,
			
			-1.0, 1.0, -1.0,
			-1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,
			
			-1.0, 1.0, -1.0,
			1.0, 1.0, 1.0,
			1.0, 1.0, -1.0,
			
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0, 1.0,
			
			-1.0, -1.0, -1.0,
			1.0, -1.0, 1.0,
			-1.0, -1.0, 1.0,
			
			1.0, -1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, 1.0, 1.0,
			
			1.0, -1.0, -1.0,
			1.0, 1.0, 1.0,
			1.0, -1.0, 1.0,
			
			-1.0, -1.0, -1.0,
			-1.0, -1.0, 1.0,
			-1.0, 1.0, 1.0,
			
			-1.0, -1.0, -1.0,
			-1.0, 1.0, 1.0,
			-1.0, 1.0, -1.0
		])		
	}
		
	// look at book how we define a function
	this.init = function(){	
		var verticies = []
		this.generateArray(verticies);
			
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);		
	}
		
	this.init()
}


CubeShapeComponent.prototype.apply = function(){
	this.vertexShaderId = this.shaderProgram.//getVertex depricated func
    gl.enableVertexAttribArray(aVertex);    
	gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);			
	gl.vertexAttribPointer(this.vertexShaderId, 3, gl.FLOAT, false, 0, 0);
	
}

CubeShapeComponent.prototype.disable = function(){
    gl.disableVertexAttribArray(this.vertexShaderId);
}


// I can replace this to function that will generate a barycentric list from a vertexies list
var CubeWireframeBuffer = {}

function generateCubeWireframe(CubeWireframeBuffer){
	CubeWireframeBuffer = gl.createBuffer()
	var _cubeWireframeList = [
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0
		])
	gl.bindBuffer(gl.ARRAY_BUFFER, this._barycentricBuffer );
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CubeWireframeBuffer), gl.DYNAMIC_DRAW);    
}
generateCubeWireframe(CubeWireframeBuffer)
