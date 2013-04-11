
var flatShader =
{
	title : 'flat',
	vs : "attribute vec3 vPosition;" + 
	"uniform mat4 uMVMatrix;" +
	"uniform mat4 uPMatrix;" +
	"void main() {			" +	
	"	gl_PointSize = 10.;" +
	"	gl_Position = uPMatrix * uMVMatrix * vec4(vPosition, 1.0);" +
	"}",

	fs : "void main() {" +
	"	gl_FragColor = vec4(1.0, 1.0, 0.0, 0.5);" + 
	"}"
}

function Program (program){
	this.program = program
	this.getVertex = function(){
		var aVertex = gl.getAttribLocation(this.program, "vPosition")
		return aVertex
	}
	this.enable = function(){
		gl.useProgram(this.program)
	}
}

var ShaderManager = function(){
	var programs = {}
	var shaders = []

	var compileShaders = function(){	
		for (var idx = 0; idx < shaders.length; ++idx){
			var shader = shaders[idx]
			
			var vertexShader = gl.createShader(gl.VERTEX_SHADER)
			gl.shaderSource(vertexShader, shader.vs)
			// maybe add some exception catching
			gl.compileShader(vertexShader)
			
			var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
			gl.shaderSource(fragmentShader, shader.fs)
			gl.compileShader(fragmentShader)	
			
			var programId = gl.createProgram()
			gl.attachShader(programId, vertexShader)
			gl.attachShader(programId, fragmentShader)
			gl.linkProgram(programId)
			
			if (!gl.getProgramParameter(programId, gl.LINK_STATUS)) {
				alert("Unable to initialize the shader program.");
			}
			
			gl.deleteShader(vertexShader)
			gl.deleteShader(fragmentShader)
			
			var shaderProgram = new Program(programId)
			programs[shader.title] = shaderProgram
		}
	}	
	shaders.push(flatShader)		
	compileShaders()
			
	return{
		getProgram : function(title){
			console.log(programs)
			console.log(title)
			return programs[title]
		}
	}
}


// unused
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

/*
 * 	pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
*/
