var Cube = function(ShaderManager){
	var m_shaderManager = ShaderManager
	
	var generateSurface = function(){
		verticies.push.apply(verticies, [
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0
		])
		
		drawOrder.push.apply(drawOrder, [ 0, 1, 2, 3, 7, 1, 5, 4, 7, 6, 2, 4, 0, 1])
	}
	
	// look at book how we define a function
	var init = function(){		
		generateVerticies();		
	}
	
	this.draw = function(){		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
	}
}



