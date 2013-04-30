Cube.prototype = new GameObject()
Cube.prototype.constructor = Cube


function Cube(){
	GameObject.call(this)
	
	this._vertexBuffer = gl.createBuffer();
	this._drawOrderBuffer = gl.createBuffer();
	this._barycentricBuffer = gl.createBuffer()
	
	this.generateArray = function(verticies, barycentric){
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
		
		barycentric.push.apply(barycentric, [
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
	}
		
	// look at book how we define a function
	this.init = function(){	
		var verticies = []
		var drawOrder = []	
		var barycentric = []
		this.generateArray(verticies, barycentric);
			
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this._barycentricBuffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.DYNAMIC_DRAW);	
	
	}
	
	this.init()
}
	
Cube.prototype.draw = function(worldMatrix){			
	var uMVPMatrix = gl.getUniformLocation(this.shaderProgram.program, "uMVPMatrix")
	
	mat4.multiply(this.MVPMatrix, worldMatrix, this.viewMatrix)
	
	gl.uniformMatrix4fv(uMVPMatrix, false, this.MVPMatrix);
	
	var uColor = gl.getUniformLocation(this.shaderProgram.program, "uColor");			
	gl.uniform4fv(uColor, [.7, .7, .7, 1]);

	
	var aVertex = this.shaderProgram.getVertex()
	gl.enableVertexAttribArray(aVertex);	
	gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);			
	gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);
	
	var aBarycentric = this.shaderProgram.getAttr("aBarycentric");
	gl.enableVertexAttribArray(aBarycentric);
	gl.bindBuffer(gl.ARRAY_BUFFER, this._barycentricBuffer);			
	gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
		
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	gl.disableVertexAttribArray(aBarycentric);
	gl.disableVertexAttribArray(aVertex);
}



