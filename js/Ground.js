Ground.prototype = new GameObject()
Ground.prototype.constructor = Ground

function Ground(){
	GameObject.call(this)

	this._verticies = []
	this._drawOrder = []
	this._barycentric = []
	this._vertexIndexBuffer = gl.createBuffer()
	this._vPosBuffer = gl.createBuffer()
	this._barycentricBuffer = gl.createBuffer()
	this._verticiesCount = 0
	this._heightMap = {}
	this._edgeSize = 15
	
	this.updateHeight = function (prevHeight, minRes, maxRes){
			var res = prevHeight;
					
			if (maxRes === undefined)
				maxRes = 0.1
				
			if (minRes === undefined)
				minRes = -0.1
			
			
			var val = Math.random() * (maxRes - minRes) + minRes
					
			res = val
	
			if (res > maxRes)
				res = maxRes
			if (res < minRes)
				res = minRes
				
			return prevHeight + res;
		}
		
	this.generateHeightMap = function(height, width){
			var map = new Array(height);
			
			var z = 0;
			
			for (var row = 0; row < height; ++row)
			{
				map[row] = new Array(width);
				for (var col = 0; col < width; ++col)
				{
					z = this.updateHeight(0, -0.3, 0)
					map[row][col] = z;
				}
			}
			return map;
		}
			
	this.generateArrays = function (colCount, rowCount, heightMap, verticies, barycentric){
		var z = 0;
		
		var halfRow = rowCount / 2.;
		var halfCol = colCount / 2.;		
		var dx = 2 / colCount;
		var dy = 2 / rowCount;
		
		
		// TODO maybe apply height not as z, but as y value, after this we can do a processing without rotation
		for (var row = 0; row < rowCount; ++row){
			for (var col = 0; col < colCount; ++col){				
				var nCol = col / halfCol - 1. ;
				var nRow = row / halfRow - 1. ;
				
				z = heightMap[row][col];				
				var midZ = this.updateHeight(z, -0.1, 0.1);
				//console.log(midZ)
				
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
		
	this.init = function(){
		this._verticies = []
		this._drawOrder = []
		this._barycentric = []
				
		this._heightMap = this.generateHeightMap(this._edgeSize, this._edgeSize)
		this.generateArrays(this._edgeSize, this._edgeSize, this._heightMap, this._verticies, this._barycentric)
		this._cellSize = 1/this._edgeSize;
		
		var vertexSize = 3; // x y z
		this._verticiesCount = this._verticies.length / vertexSize;	
		
		mat4.identity(this.MVPMatrix);
							
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._verticies), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this._barycentricBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._barycentric), gl.DYNAMIC_DRAW);
	}
	
	this.init()	
	
}
	
	
Ground.prototype.getHeight = function(row, col){
	return this._heightMap[row][col];
}
		
Ground.prototype.getCellSize = function(){
	return this._cellSize;
}
		
Ground.prototype.getCellCount = function(){
	return this._edgeSize;
}
		
Ground.prototype.draw = function(worldMatrix/*or cameraMatrix*/){
	// TODO move this function to ShaderManager object, now i don't know how to do it			
	var uMVMatrix = gl.getUniformLocation(this.shaderProgram.program, "uMVPMatrix");
	
	mat4.multiply(this.MVPMatrix, worldMatrix, this.viewMatrix)
		
	gl.uniformMatrix4fv(uMVMatrix, false, this.MVPMatrix);			
		
	var uColor = gl.getUniformLocation(this.shaderProgram.program, "uColor");			
	gl.uniform4fv(uColor, [0., .5, 0., 1.]);
	

	var aVertex = this.shaderProgram.getVertex()
	gl.enableVertexAttribArray(aVertex);	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this._vPosBuffer);			
	gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);

	var aBarycentric = this.shaderProgram.getAttr("aBarycentric");
	gl.enableVertexAttribArray(aBarycentric);
	gl.bindBuffer(gl.ARRAY_BUFFER, this._barycentricBuffer);
	gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
				
	gl.drawArrays(gl.TRIANGLES, 0, this._verticiesCount);
	
	gl.disableVertexAttribArray( aBarycentric)
	gl.disableVertexAttribArray( aVertex)
}
	

