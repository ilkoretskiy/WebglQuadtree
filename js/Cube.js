var Cube = function(){
	var vertexBuffer = gl.createBuffer();
	var drawOrderBuffer = gl.createBuffer();
	var PMatrix = mat4.create();
	var	MVMatrix = mat4.create();
	var barycentricBuffer = gl.createBuffer()
		
	
	var generateArray = function(verticies, barycentric){
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
	
	var generateElements = function(verticies, drawOrder, barycentric){		
		verticies.push.apply(verticies, [
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,
			
			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,
			
			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,
			
			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,
			
			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,
			
			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0
		])
		
		barycentric.push.apply(barycentric, [
			// Front face
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			
			// Back face
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			
			// Top face
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			
			// Bottom face
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			
			// Right face
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			
			// Left face
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
			0.0,  0.0,  0.0,
		])
		
		drawOrder.push.apply(drawOrder, [  
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23    // left])
		])
		
	}
	
	// look at book how we define a function
	var init = function(){	
		var verticies = []
		var drawOrder = []	
		var barycentric = []
		generateArray(verticies, barycentric);

		mat4.identity(MVMatrix);					
		mat4.identity(PMatrix);
				
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.DYNAMIC_DRAW);	

		/*
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, drawOrderBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(drawOrder), gl.STATIC_DRAW);
		drawOrderBuffer.numItems = drawOrder.length;
		* */
	}
	
	init()
	
	return {
		setShaderProgram : function(program){
			this.shaderProgram = program	
			//console.log(this)	
			return this	
		},
		
		setGlobalTransform : function(matrix){
			PMatrix = matrix	
			return this
		},
		
		getMotionMatrix : function(){
			return MVMatrix
		},
				
		draw : function(){
			var uPMatrix = gl.getUniformLocation(this.shaderProgram.program, "uPMatrix")
			gl.uniformMatrix4fv(uPMatrix, false, PMatrix);
			
			var uMVMatrix = gl.getUniformLocation(this.shaderProgram.program, "uMVMatrix")
			gl.uniformMatrix4fv(uMVMatrix, false, MVMatrix);
			
			var uColor = gl.getUniformLocation(this.shaderProgram.program, "uColor");			
			gl.uniform4fv(uColor, [.7, .7, .7, 1]);

			
			var aVertex = this.shaderProgram.getVertex()
			gl.enableVertexAttribArray(aVertex);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);			
			gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);
			
			var aBarycentric = this.shaderProgram.getAttr("aBarycentric");
			//console.log("aBarycentric"  + aBarycentric);
			gl.enableVertexAttribArray(aBarycentric);
			gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);			
			gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
			
			
			//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, drawOrderBuffer)			
			gl.drawArrays(gl.TRIANGLES, 0, 36);
			gl.flush()
			
			gl.disableVertexAttribArray(aBarycentric);
			gl.disableVertexAttribArray(aVertex);
		}
	}
}



