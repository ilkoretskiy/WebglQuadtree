var Ground = function(){	
	var verticies = [],
		drawOrder = [],
		barycentric = [],
		uPMatrix = mat4.create(),
		mvMatrix = mat4.create(),
		vertexIndexBuffer = gl.createBuffer(),
		vPosBuffer = gl.createBuffer(),
		barycentricBuffer = gl.createBuffer()
	
	
	var generateSurface = function(verticies, drawOrder, barycentric, columnCount, rowCount){
		// we map 0..count to -1,1 
		
		var colNorm = 2 / columnCount;
		var rowNorm = 2 / rowCount;
		
		var z = 0
		
		var barPos = 0;
		
		for (var row = 0; row < rowCount + 1; ++row)
		{
			for (var col = 0; col < columnCount + 1; ++col)
			{
				verticies.push.apply(verticies, [(col - columnCount / 2) * colNorm, (row - rowCount / 2) * rowNorm, z])
				barycentric.push.apply(barycentric, [1 * (barPos == 0), 1 * (barPos == 1), 1 * (barPos == 2)])
				barPos += 1;
				barPos %= 3;
				
				/*
				var val = Math.random() / 50
													
				if (Math.random() > 0.5)
				{
					z += val
				}
				else
				{
					z -= val
				}
				*/
				if (col != columnCount && row != rowCount)
				{
					var idx = col + row * (columnCount + 1);
					var idxNextRow = col + (row + 1) * (columnCount + 1);
					var drawList = [idx, idx + 1, idxNextRow + 1, idxNextRow + 1, idxNextRow, idx];
					drawOrder.push.apply(drawOrder, drawList)
				}
			}
		}
		
		// add border drawing
		drawOrder.push.apply(drawOrder, [(rowCount + 1) * (columnCount + 1) - 1, (rowCount + 1) * (columnCount )])
		drawOrder.push.apply(drawOrder, [(rowCount + 1) * (columnCount + 1) - 1, rowCount])
		console.log(barycentric)
	}
	
	var _init = function(){
		verticies = []
		drawOrder = []
		barycentric = []
		generateSurface(verticies, drawOrder, barycentric, 7, 7)
		console.log(verticies)
					
		mat4.identity(mvMatrix);
		mat4.identity(uPMatrix);
		
					
		gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);	
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(drawOrder), gl.STATIC_DRAW);
		vertexIndexBuffer.numItems = drawOrder.length;
	}
	
	_init()
	
	// why i can't do this with this.var = function ?
	return{			
		setShaderProgram : function(program){
			this.shaderProgram = program			
			return this
		},
		
		setGlobalTransform : function(matrix){
			uPMatrix = matrix			
			return this
		},
		
		getMotionMatrix : function(){
			return mvMatrix
		},
		
		draw : function(){					
			// TODO change this function to ShaderManager object, now i don't know how to do it
			var pUniform = gl.getUniformLocation(this.shaderProgram.program, "uPMatrix");
			var mvUniform = gl.getUniformLocation(this.shaderProgram.program, "uMVMatrix");
			
			gl.uniformMatrix4fv(pUniform, false, uPMatrix);
			gl.uniformMatrix4fv(mvUniform, false, mvMatrix);

			var aVertex = this.shaderProgram.getVertex()
			gl.enableVertexAttribArray(aVertex);	
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);			
			gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);

			var aBarycentric = this.shaderProgram.getAttr("aBarycentric");
			gl.enableVertexAttribArray(aBarycentric);
			gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);			
			gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
			
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);			
			gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			gl.disableVertexAttribArray( aBarycentric)
			gl.disableVertexAttribArray( aVertex)
		}
	}
}
