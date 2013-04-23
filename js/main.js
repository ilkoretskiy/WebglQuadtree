var vertexPositionAttribute  = {}
var canvas = {}
var ground = {}

var Positions = []
var Objects = []
var GroundObjects = []
var shaderManager = {}
var pMatrix = {}
var rotationAngle = vec3.create();
var groundCross = {}
var cameraMatrix = {}

function onLoad()
{
	initCanvas()	
	initShaders();
	initBuffers();
	
	global_angle = 0;
	setInterval(update, 30);
	//update();
}

function initCanvas()
{
	canvas = document.getElementById("drawArea");
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
	gl = null;
	for (var i =0; i < names.length; ++i){
		try {
			gl = canvas.getContext(names[i], {antialias : true});			
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} catch(e) {}
		
		if (gl){
			console.log("success")
			break;
		}
	}
	
	canvas.addEventListener("mousedown", handleMouseDown, false)
	canvas.addEventListener("mouseup", handleMouseUp, false)
	canvas.addEventListener("mousemove", handleMouseMove, false)
}


//copied from quad_tree.js
function getCursorPosition(e){
	if (typeof(e) == 'undefined')
	{
		console.log("error pos" , e)
		return 
	}
	var x;
	var y;
	if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    
    x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

    return (new Point(x, y))
}


function Point(x, y){
	this.x = x
	this.y = y
}

var isPressed = false;
var lastPressedPos = {}
var diffPos = new Point(0, 0)
var posOnMouseDown = {}
var posOnMouseUp  = {}

// TODO make a raytracer


function handleMouseDown(e)
{
	//console.log("mousedown", e)	
	var mousePos = getCursorPosition(e);
	lastPressedPos = mousePos;
	isPressed = true	
	posOnMouseDown  = new Point(mousePos.x, mousePos.y)
}

function handleMouseMove(e)
{
	if (isPressed)
	{
		var mousePos = getCursorPosition(e);		
		diffPos.x = (mousePos.x - lastPressedPos.x);
		diffPos.y = (mousePos.y - lastPressedPos.y);
		rotationAngle[0] += diffPos.y
		rotationAngle[1] += diffPos.x
		lastPressedPos = mousePos;
	}
	else
	{
		/*
		gl.onmousedown = function(e) {
			var tracer = new GL.Raytracer();
			var ray = tracer.getRayForPixel(e.x, e.y);
			var pointOnPlane = tracer.eye.add(ray.multiply(-tracer.eye.y / ray.y));
			var sphereHitTest = GL.Raytracer.hitTestSphere(tracer.eye, ray, center, radius);
			if (sphereHitTest) {
			mode = MODE_MOVE_SPHERE;
			prevHit = sphereHitTest.hit;
			planeNormal = tracer.getRayForPixel(gl.canvas.width / 2, gl.canvas.height / 2).negative();
			} else if (Math.abs(pointOnPlane.x) < 1 && Math.abs(pointOnPlane.z) < 1) {
			mode = MODE_ADD_DROPS;
			gl.onmousemove(e);
			} else {
			mode = MODE_ORBIT_CAMERA;
			}
		};*/
	}
}

function handleMouseUp(e)
{
	var mousePos = getCursorPosition(e);
	posOnMouseDown  = new Point(mousePos.x, mousePos.y)
	isPressed = false;	
}

function initShaders(){	
	shaderManager = new ShaderManager()	
}

var cellCount = {};
var boxScale = {};

function initBuffers(){	
	groundCross =  (new Cross).setShader(shaderManager.getProgram('flat'))
	
	var shader = shaderManager.getProgram('wireframe')
	var ground = (new Ground()).setShader(shader)
	GroundObjects.push(ground)
	cellCount = ground.getCellCount()
	boxScale = 1./cellCount;	
	
	for (var i = 0; i < 5; ++i)
	{
		Objects.push((new Cube()).setShader(shader))
		Positions.push({x:0, y:0})
	}
	
		
	pMatrix = mat4.create();
	mat4.perspective(pMatrix, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
	cameraMatrix = mat4.create()
	mat4.identity(cameraMatrix);
}

//StackMatrix.push
//StackMatrix.pop 

function DrawGround(){
	var VPMatrix = mat4.create()	
	mat4.multiply(VPMatrix, pMatrix, cameraMatrix) 
	for (var idx = 0; idx < GroundObjects.length; ++idx){
		var curObject = GroundObjects[idx]		
		curObject.setGlobalTransform(VPMatrix)		
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
	if (rnd > 0.98)
	{
		shift = 1
	}
	else if(rnd < 0.02)
	{
		shift = -1
	}
	val += shift
	if (val < 0)
	{
		val += cellCount
	}
	val %= cellCount
	return val
}



function MoveObjectToCell(mat, row, col)
{		
	// i made a mistake somewhere and don't know exactly why swapped col and row
	var groundHeight = GroundObjects[0].getHeight(col, row);
	// "-" because z is reversed
	var boxHeight = -groundHeight / boxScale + 1;
	
	// TODO get from ground
	var cellSize = 1	
	var objectLen = 2
	
	// translate to 0 0
	mat4.translate( mat, mat, [objectLen/2, boxHeight, objectLen/2])
	mat4.translate( mat, mat, [objectLen * (row  - (cellCount / 2)), 0, objectLen * ( col - (cellCount / 2))])
}

var x = 0
var y = 0
function DrawObjects(){	
	var VPMatrix = mat4.create()	
	mat4.multiply(VPMatrix, pMatrix, cameraMatrix) 
	for (var idx = 0; idx < Objects.length; ++idx){		
		var curObject = Objects[idx]
		curObject.setGlobalTransform(VPMatrix)
		var mat = curObject.getMotionMatrix();
		
		// TODO replace to matrix stack		
		mat4.identity(mat)
		
		// lift cube to a half of it size and set initial pos as 0
		
		//mat4.translate( mat, mat, moveDist)
		//mat4.rotateY(mat, mat, Math.PI * global_angle / 180.)
		mat4.scale(mat, mat, [boxScale, boxScale, boxScale])			
		
		position = Positions[idx]
		//position.x = idx
		//position.y = 0
		position.x = updateCoord(position.x)
		position.y = updateCoord(position.y)		
		
		MoveObjectToCell(mat, position.y, position.x)				
		curObject.draw()		
	}	
}

/* unproject - convert screen coordinate to WebGL Coordinates 
 *   winx, winy - point on the screen 
 *   winz       - winz=0 corresponds to newPoint and winzFar corresponds to farPoint 
 *   mat        - model-view-projection matrix 
 *   viewport   - array describing the canvas [x,y,width,height] 
 */ 
function unproject(winx,winy,winz,mat,viewport){ 
  winx = 2 * (winx - viewport[0])/viewport[2] - 1; 
  winy = 2 * (winy - viewport[1])/viewport[3] - 1; 
  winz = 2 * winz - 1; 
  var invMat = mat4.create();    
  mat4.invert(invMat, mat); 
  //console.log("unpr" , invMat)
  
  var n = [winx,winy,winz,1] 
  mat4.multiplyVec4(invMat,n,n); 
  
  return [n[0]/n[3],n[1]/n[3],n[2]/n[3]] 
} 

function drawGroundCross()
{
	var viewport = [0, 0, gl.viewportWidth, gl.viewportHeight]
	var invertedY = gl.viewportHeight - posOnMouseDown.y


	var MVPMatrix =  mat4.create();
	
	mat4.multiply(MVPMatrix, pMatrix, cameraMatrix)
	
	
	var debugNear1 = unproject(posOnMouseDown.x, invertedY, 0, MVPMatrix, viewport)
	var debugFar1 = unproject(posOnMouseDown.x, invertedY, 1, MVPMatrix, viewport)	
	
	console.log(debugNear1 + '\t' + debugFar1) 		
	
	groundCross.getShader().enable()
	groundCross.setGlobalTransform(mat4.identity(mat4.create()))
	
	var crossMatrix = groundCross.getMotionMatrix()	
	mat4.identity(crossMatrix);		

	// TODO do MatrixStack to linking object to ground or move this to Scene object

	groundCross.draw([debugNear1, debugFar1]);

}

var moveDist = [0, -0.5, -3]
var FixedAngle = 1

function toRad(grad){
	return grad * Math.PI / 180
}

function update()
{
	gl.clearColor(0, .1, 0, .8);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND)
	
	// At the current moment i don't know exactily meanings of this attributes
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)	
	gl.depthFunc(gl.LESS);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
	
	
	if (FixedAngle){
		global_angle = 90
	}
	else{
		global_angle = (global_angle + 1) % 360;
	}
	
	// TOTHINK - is this is a good practice to remake convertation of matrix every time 
	
	mat4.identity(cameraMatrix);
	// Why reverse order

	mat4.translate(cameraMatrix, cameraMatrix, moveDist)	
	mat4.rotateX(cameraMatrix, cameraMatrix, toRad(rotationAngle[0]))
	mat4.rotateY(cameraMatrix, cameraMatrix, toRad(rotationAngle[1]))
	mat4.rotateZ(cameraMatrix, cameraMatrix, toRad(rotationAngle[2]))

	
	/*
	mat4.rotateX(cameraMatrix, cameraMatrix, rotationAngle[0] * Math.PI / 180)
	mat4.rotateY(cameraMatrix, cameraMatrix, rotationAngle[1] * Math.PI / 180)
	mat4.rotateZ(cameraMatrix, cameraMatrix, rotationAngle[2] * Math.PI / 180)
	moveDist[0] 
	mat4.lookAt(cameraMatrix, moveDist, [0, 0, 0], [0, 0, -1]);// = function (out, eye, center, up) {
	*/
		
	//console.log(rotationAngle)
	
	//mat4.rotateY(cameraMatrix, cameraMatrix, global_angle * Math.PI / 180 )	
	
	// ToTHink - render pipeline
	
	// TODO reduce count of program changing
	shaderManager.getProgram('wireframe').enable()
	DrawGround()
	DrawObjects()		
	
	if (isPressed)
	{
		drawGroundCross()
	}
}

// TODO make a Scene object. It must control all positions of added objects 
