var vertexPositionAttribute  = {}
var canvas = {}
var ground = {}

var Positions = []
var Objects = []
var GroundObjects = []
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
	
	// TODO move all this to some other func
	canvas.onmouse
	
	initShaders();
	initBuffers();
	
	global_angle = 0;
	setInterval(update, 80);
	//update();
}

function initShaders(){	
	shaderManager = new ShaderManager()
	var shaderProgram = shaderManager.getProgram('flat')
	shaderProgram.enable()
}

function initBuffers(){
	var flatProgram = shaderManager.getProgram('flat')
	
	GroundObjects.push((new Ground()).setShaderProgram(flatProgram))
	//GroundObjects.push((new Ground()).setShaderProgram(flatProgram))
	
	for (var i = 0; i < 5; ++i)
	{
		Objects.push((new Cube()).setShaderProgram(flatProgram))
		Positions.push({x:0, y:0})
	}
	
		
	pMatrix = mat4.create();
	mat4.perspective(pMatrix, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
}

var moveDist = [0, -1, -3]


//StackMatrix.push
//StackMatrix.pop 

function DrawGround(){
	for (var idx = 0; idx < GroundObjects.length; ++idx){
		var curObject = GroundObjects[idx]
		curObject.setGlobalTransform(pMatrix)		
		var mat = curObject.getMotionMatrix();		
				
		// TODO replace to matrix stack		
		mat4.identity(mat)
		//mat4.translate( mat, mat, moveDist)
		//mat4.rotateY(mat, mat, Math.PI * global_angle / 180.)	
		
		if (idx == 0)
		{
			mat4.rotateX(mat, mat, Math.PI * 90 / 180.)				
		}
		else
		{
			mat4.translate(mat, mat, [0, 1, 1])
		}
		curObject.draw()		
	}	
}


function updateCoord(val)
{
	var rnd = Math.random()
	var shift = 0
	if (rnd > 0.66)
	{
		shift = 1
	}
	else if(rnd < 0.33)
	{
		shift = 0
	}
	val += shift
	if (val < 0)
	{
		val += 8
	}
	val %= 8
	return val
}


function MoveObjectToCell(mat, row, col)
{
	// TODO get from ground
	var cellSize = 1
	var cellCount = 8	
	var objectLen = 2
	// translate to 0 0
	mat4.translate( mat, mat, [objectLen/2, 1, objectLen/2])
	mat4.translate( mat, mat, [objectLen * (row  - (cellCount / 2)), 0, objectLen * ( col - (cellCount / 2))])
}

var x = 0
var y = 0
function DrawObjects(){
	var scale = 1/8.
	for (var idx = 0; idx < Objects.length; ++idx){		
		var curObject = Objects[idx]
		curObject.setGlobalTransform(pMatrix)
		var mat = curObject.getMotionMatrix();
		
		// TODO replace to matrix stack		
		mat4.identity(mat)
		
		// lift cube to a half of it size and set initial pos as 0
		
		//mat4.translate( mat, mat, moveDist)
		//mat4.rotateY(mat, mat, Math.PI * global_angle / 180.)
		mat4.scale(mat, mat, [scale, scale, scale])			
		
		position = Positions[idx]
		position.x = updateCoord(position.x)
		position.y = updateCoord(position.y)		
		
		MoveObjectToCell(mat, position.y, position.x)				
		curObject.draw()		
	}	
}

function update()
{
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
	
	global_angle = (global_angle + 1) % 360;
	//global_angle = 90
	
	// TOTHINK - is this is a good practice to remake convertation of matrix every time 
	mat4.perspective(pMatrix, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
	
	// Why reverse order
	mat4.translate(pMatrix, pMatrix, moveDist)
	mat4.rotateY(pMatrix, pMatrix,  global_angle * Math.PI / 180 )	
	
	DrawGround()
	DrawObjects()
}
