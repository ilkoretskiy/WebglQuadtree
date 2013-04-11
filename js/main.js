var vertexPositionAttribute  = {}
var canvas = {}
var ground = {}
var objects = []
var shaderManager = {}
var pMatrix = {}
function onLoad()
{
	canvas = document.getElementById("drawArea");
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
	gl = null;
	for (var i =0; i < names.length; ++i){
		try {
			gl = canvas.getContext(names[i]);			
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} catch(e) {}
		
		if (gl){
			console.log("success")
			break;
		}
	}
	initShaders();
	initBuffers();	
	
	global_angle = 0;
	setInterval(update, 30);
	//update();
}

function initShaders(){	
	shaderManager = new ShaderManager()
	var shaderProgram = shaderManager.getProgram('flat')
	shaderProgram.enable()
}

function initBuffers(){
	var flatProgram = shaderManager.getProgram('flat')
	
	var ground = new Ground()
	ground.setShaderProgram(flatProgram)
	var ground2 = new Ground();
	ground2.setShaderProgram(flatProgram)
	
	objects.push(ground)
	objects.push(ground2)	


	var g1Matrix =  ground.getMotionMatrix();
	mat4.translate( g1Matrix, g1Matrix, [0, 0, -1])
				
	var g2Matrix =  ground2.getMotionMatrix();
	mat4.translate(g2Matrix, g2Matrix, [0, 0, -1])	
	

	
	pMatrix = mat4.create();
	mat4.perspective(pMatrix, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
	//mat4.rotateY(pMatrix, pMatrix, Math.PI * 0.2 / 180.)
}

function update()
{
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
	
	global_angle = (global_angle + 1) % 360;
	
	// TOTHINK - is this is a good practice to remake convertation matrix every time 
	
	for (var idx = 0; idx < objects.length; ++idx){
		var curObject = objects[idx]
		curObject.setGlobalTransform(pMatrix)
		var mat = curObject.getMotionMatrix();
		//mat4.rotateX(mat, mat, Math.PI * 1 / 180.)
		
		mat4.identity(mat)
		mat4.translate( mat, mat, [0, -0.5, -2])
		mat4.rotateY(mat, mat, Math.PI * global_angle / 180.)
		
		if (idx == 1){
			mat4.rotateX(mat, mat, Math.PI * 90 / 180.)			
			
		}
		
		curObject.draw()
		
	}	
	
}
