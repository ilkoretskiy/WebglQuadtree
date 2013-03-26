var vertexPositionAttribute  = {}
var canvas = {}

function onLoad()
{
	canvas = document.getElementById("drawArea");
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
	gl = null;
	for (var i =0; i < names.length; ++i){
		try {
			gl = canvas.getContext(names[i]);
		} catch(e) {}
		
		if (gl){
			console.log("success")
			break;
		}
	}
	
	initBuffers();
	initShaders();
	draw();
	
	
}

function initBuffers(){
	vPosBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);
	
	var verticies = [
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
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
	
	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	  
	var cubeVertexIndices = [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23    // left
	]	
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

function getShaderSource(shaderNode){
	var shaderSource = "";
	var node = shaderNode.firstChild;
	while (node) {
		if (node.nodeType == 3)
			shaderSource += node.textContent;
		node = node.nextSibling
	}
	return shaderSource
}

function initVertexShader(){
	var shaderNode = document.getElementById("vertexShader");
	var source = getShaderSource(shaderNode)
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	
	gl.shaderSource(vertexShader, source)
	gl.compileShader(vertexShader)
	
	return vertexShader;		
}

function initFragmentShader(){
	var shaderNode = document.getElementById("fragmentShader");
	var source = getShaderSource(shaderNode)
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(fragmentShader, source)
	gl.compileShader(fragmentShader)
	
	return fragmentShader;
}

function initShaders(){
	var vertexShader = initVertexShader();
	var fragmentShader = initFragmentShader();
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader)
	gl.attachShader(shaderProgram, fragmentShader)
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}
	
	gl.useProgram(shaderProgram)
  
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
}

function draw()
{
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	
	perspectiveMatrix = makePerspective(45, 640./480., 0.1 , 100.0)
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer)
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
	
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
}
