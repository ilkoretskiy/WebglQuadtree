
var wireframeShader =
{
	title : 'wireframe',
	vs :
	"attribute vec3 vPosition;\n" +
	"attribute vec3 aBarycentric;\n" +	
	"varying vec3 vPosOut;\n" +	
	"varying vec4 vColor;\n" + 
	"uniform mat4 uMVMatrix;\n" +
	"uniform mat4 uPMatrix;\n" +
	"uniform vec4 uColor;\n" + 
	"void main() {			\n" +	
	"	gl_PointSize = 1.;\n" +
	"	gl_Position =  uPMatrix * uMVMatrix *  vec4(vPosition, 1.0);\n" +
	" 	vPosOut = aBarycentric;\n"+
	" 	vColor = uColor;\n"+
	"}\n",

	fs :	
	"varying highp vec3 vPosOut;\n" +
	"varying highp vec4 vColor;\n" +
	"precision mediump float;	\n" + 
	"void main() {\n" +	
		"float threshold = 0.08; \n" +
		"if (any(lessThan( vPosOut, vec3(threshold))))\n"+
		"{\n" +
		"	float minVal = threshold - min(min(vPosOut.x, vPosOut.y), vPosOut.z); \n"+
		"	minVal /= threshold;\n" +
		"	gl_FragColor = vec4(vColor.rgb, minVal); \n" +
		"}\n" +
		
		"else\n" +
		"{" +
		"	gl_FragColor =  vec4(vColor.rgb, 0.1) ; " +
		"}" +
	"}"
}

var flatShader =
{
	title : 'flat',
	vs :
	"attribute vec3 vPosition;\n" +
	"varying vec4 vColor;\n" + 
	"uniform mat4 uMVMatrix;\n" +
	"uniform mat4 uPMatrix;\n" +
	"uniform vec4 uColor;\n" + 
	"void main() {			\n" +	
	"	gl_Position =  uPMatrix * uMVMatrix *  vec4(vPosition, 1.0);\n" +	
	" 	vColor = uColor;\n"+
	"}\n",

	fs :	
	"varying highp vec4 vColor;\n" +
	"precision mediump float;	\n" + 
	"void main() {\n" +	
		"	gl_FragColor = vColor; \n" +
	"}"
}

function Program (program){
	this.program = program
	this.getVertex = function(){
		var aVertex = gl.getAttribLocation(this.program, "vPosition")
		return aVertex
	}
	this.getAttr = function(name){
		var attrib = gl.getAttribLocation(this.program, name)
		return attrib

	}
	this.enable = function(){
		gl.useProgram(this.program)
	}
}


function verifyShader(stype, shader)
{
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS) == false){
		var error = gl.getShaderInfoLog(shader);
		var lines = error.split('\n');
		for (var i = 0; i < lines.length; ++i)
		{
			console.log(stype, lines[i])
		}
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
			verifyShader('vx', vertexShader)
			
			var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
			gl.shaderSource(fragmentShader, shader.fs)
			gl.compileShader(fragmentShader)	
			verifyShader('fs', fragmentShader)
			
			var programId = gl.createProgram()
			gl.attachShader(programId, vertexShader)
			gl.attachShader(programId, fragmentShader)
			gl.linkProgram(programId)
			
			if (!gl.getProgramParameter(programId, gl.LINK_STATUS)) {
				var error = gl.getProgramInfoLog(programId)
				console.log("link error " , error)
				alert("Unable to initialize the shader program. " +  error);
			}
			
			
			gl.deleteShader(vertexShader)
			gl.deleteShader(fragmentShader)
			
			var shaderProgram = new Program(programId)
			programs[shader.title] = shaderProgram
		}
	}	
	shaders.push(wireframeShader)
	shaders.push(flatShader)
	compileShaders()
			
	return{
		getProgram : function(title){			
			//console.log(programs)
			//console.log(title)
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
