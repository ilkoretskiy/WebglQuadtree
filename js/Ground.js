var Ground = function(){	
	var verticies = [],
		drawOrder = [],
		barycentric = [],
		MVPMatrix = mat4.create(),
		vertexIndexBuffer = gl.createBuffer(),
		vPosBuffer = gl.createBuffer(),
		barycentricBuffer = gl.createBuffer(),
		verticiesCount = 0,
		heightMap = {},
		edgeSize = 10
		//width = 10,
		//height = 10
	
	var updateHeight = function (prevHeight, maxRes, minRes){
		var res = prevHeight;
		var val = Math.random() - 0.5
		
		if (maxRes === undefined)
			maxRes = 0.1
			
		if (minRes === undefined)
			minRes = -0.1
		//var maxRes = 0.2
		//var minRes = -0.2
				
		res = val
		/*		
		if (Math.random() > 0.5)
		{
			res += val
		}
		else
		{
			res -= val
		}
		*/
		if (res > maxRes)
			res = maxRes
		if (res < minRes)
			res = minRes
		return res;
	}
	
	var generateHeightMap = function(height, width){
		var map = new Array(height);
		
		var z = 0;
		
		for (var row = 0; row < height; ++row)
		{
			map[row] = new Array(width);
			for (var col = 0; col < width; ++col)
			{
				z = updateHeight(z)
				map[row][col] = z;
			}
		}
		return map;
	}
		
	var generateArrays = function (colCount, rowCount, heightMap, verticies, barycentric){
		var z = 0;
		
		var halfRow = rowCount / 2.;
		var halfCol = colCount / 2.;		
		var dx = 2 / colCount;
		var dy = 2 / rowCount;
		
		console.log(heightMap)
		
		
		// TODO maybe apply height not as z, but as y value, after this we can do a processing without rotation
		for (var row = 0; row < rowCount; ++row){
			for (var col = 0; col < colCount; ++col){				
				var nCol = col / halfCol - 1. ;
				var nRow = row / halfRow - 1. ;
				
				z = heightMap[row][col];
				var midZ = updateHeight(z);
				
				var midPoint = [nCol + dx / 2., nRow + dy / 2., midZ];
								
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
	
	var generateElements = function(columnCount, rowCount, verticies, drawOrder, barycentric){
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
	}
	
	var _init = function(){
		verticies = []
		drawOrder = []
		barycentric = []
		
		heightMap = generateHeightMap(edgeSize, edgeSize)		
		generateArrays(edgeSize, edgeSize, heightMap, verticies, barycentric)
		cellSize = 1/edgeSize;
		
		var vertexSize = 3; // x y z
		verticiesCount = verticies.length / vertexSize;
		
		//generateElements(7, 7, verticies, drawOrder, barycentric)
					
		mat4.identity(MVPMatrix);
		
					
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
		setShader : function(program){
			this.shaderProgram = program			
			return this
		},
		
		getShader : function(){
			return this.shaderProgram
		},
		
		getMotionMatrix : function(){
			return MVPMatrix
		},
		
		getHeight : function(row, col){
			return heightMap[row][col];
		},
		
		getCellSize : function(){
			return cellSize;
		},
		
		getCellCount : function(){
			return edgeSize;
		},
		
		draw : function(){					
			// TODO change this function to ShaderManager object, now i don't know how to do it			
			var uMVMatrix = gl.getUniformLocation(this.shaderProgram.program, "uMVPMatrix");
			gl.uniformMatrix4fv(uMVMatrix, false, MVPMatrix);			
			
			var uColor = gl.getUniformLocation(this.shaderProgram.program, "uColor");			
			gl.uniform4fv(uColor, [0., .5, 0., 1.]);
			

			var aVertex = this.shaderProgram.getVertex()
			gl.enableVertexAttribArray(aVertex);	
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);			
			gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);

			var aBarycentric = this.shaderProgram.getAttr("aBarycentric");
			gl.enableVertexAttribArray(aBarycentric);
			gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);			
			gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
						
			gl.drawArrays(gl.TRIANGLES, 0, verticiesCount);
			gl.flush();
			
			//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
			//gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			gl.disableVertexAttribArray( aBarycentric)
			gl.disableVertexAttribArray( aVertex)
		}
	}
}
