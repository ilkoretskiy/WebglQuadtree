var Cross = function(){	
	var verticies = [],
		drawOrder = [],
		barycentric = [],
		uPMatrix = mat4.create(),
		mvMatrix = mat4.create(),
		vertexIndexBuffer = gl.createBuffer(),
		vPosBuffer = gl.createBuffer(),
		barycentricBuffer = gl.createBuffer(),
		verticiesCount = 0,
		heightMap = {},
		edgeSize = 10
		//width = 10,
		//height = 10
	

	var generateArrays = function (verticies){
		
		verticies.push.apply(verticies, [-1, -1, 0,
		1, 1, 0,
		-1, 1, 0,
		1, -1, 0
		])
	}
	
	var _init = function(){
		verticies = []	
		
		generateArrays(verticies)
		
		//generateElements(7, 7, verticies, drawOrder, barycentric)
					
		mat4.identity(mvMatrix);
		mat4.identity(uPMatrix);
		
					
		gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.DYNAMIC_DRAW);		
	}
	
	_init()
	
	// why i can't do this with this.var = function ?
	return{			
		setShader : function(program){
			this.shaderProgram = program			
			return this
		},
		
		getShader : function(){
			return this.shaderProgram
		},
		
		setGlobalTransform : function(matrix){
			uPMatrix = matrix			
			return this
		},
		
		getMotionMatrix : function(){
			return mvMatrix
		},
		

		draw : function(points){					
			// uniforms
			{
				// TODO change this function to ShaderManager object, now i don't know how to do it
				var pUniform = gl.getUniformLocation(this.shaderProgram.program, "uPMatrix");
				gl.uniformMatrix4fv(pUniform, false, uPMatrix);
				
				var mvUniform = gl.getUniformLocation(this.shaderProgram.program, "uMVMatrix");
				gl.uniformMatrix4fv(mvUniform, false, mvMatrix);			
				
				var uColor = gl.getUniformLocation(this.shaderProgram.program, "uColor");			
				gl.uniform4fv(uColor, [1., 1, 1., 1.]);
			}
			
			var aVertex = this.shaderProgram.getVertex()
			gl.enableVertexAttribArray(aVertex);	
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);			
			
			
			// TODO REMOVE THIS only for debug
			verticies = []
			verticies.push.apply(verticies, [points[0][0], points[0][1], points[0][2], points[1][0], points[1][1], points[1][2]])
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
			
			
			gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);			
			gl.drawArrays(gl.LINES, 0, 2);
			gl.flush();
						
			gl.disableVertexAttribArray( aVertex)
		}
	}
}
