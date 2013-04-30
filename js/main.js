g = {}
g.camera = {}
g.mouseHandler = {}
g.objects = {}
g.objects.ground = {}
g.objects.cubes = []

var canvas = {}
var ground = {}
var Positions = []

var GroundObjects = []
var shaderManager = {}

var groundCross = {}
var groundCube = {}


var fullscreen_mode = 1

function onLoad()
{
	initCanvas()	
	initShaders();
	initBuffers();
	
	//addUiControl()
	
	if (fullscreen_mode)
		fullscreen()
	
	global_angle = 0;
	setInterval(update, 30);
	//update();
}

function fullscreen(){
	//canvas.webkitRequestFullScreen()

}

function addUiControl()
{
	var container = document.getElementById("ui-controls")
	
	var newEl = document.createElement("button")
	newEl.class  = "btn"
	newEl.type = "button"
	newEl.innerHtml  = "Text" 	
	newEl.appendChild(document.createTextNode("Click"))
	
	container.appendChild(newEl)
	
	/*	
	var controlDiv = document.createElement('div')
	controlDiv.setAttribute('id' , "innerDiv")
	container
	
	console.log(container)
	container.innerHtml = html;
	console.log(container)
	* */
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
		
	g.camera = new Camera(45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)	
	g.scene = new Scene()
	connectMouseEvents(canvas)
	
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
		
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND)
	
	// At the current moment i don't know exactily meanings of this attributes
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)	
	gl.depthFunc(gl.LESS);
}


function initShaders(){	
	shaderManager = new ShaderManager()	
}

var cellCount = {};
var boxScale = {};

function initBuffers(){
	var shader = shaderManager.getProgram('wireframe')	
	
	g.objects.ground = (new Ground()).setShader(shader)
	g.scene.add(g.objects.ground)
	
	
	g.objects.cubes.push((new Cube()).setShader(shader))
	g.scene.add(g.objects.cubes[0])
	/*
	var ground = new Ground().setShader(shader)
	for (var i = 0; i < 10; ++i)
	{
		ground.add((new Cube()).setShader(shader))
	}*/
	
	
	
	//Scene.add(Ground, {program : "wireframe"})
	/*
	groundCross =  (new Cross).setShader(shaderManager.getProgram('flat'))
	
	
	
	GroundObjects.push(ground)
	cellCount = ground.getCellCount()
	boxScale = 1./cellCount;	
	
	//GroundObjects.push((new Ground()).setShader(shader))
	
	groundCube = (new Cube()).setShader(shader)
	for (var i = 0; i < 10; ++i)
	{
		Objects.push((new Cube()).setShader(shader))
		Positions.push({x:0, y:0})
	}
	* */			
}

//StackMatrix.push
//StackMatrix.pop 

function UpdateGround(){	
	var VPMatrix = g.camera.getProjViewMatrix()			
	//var mat = curObject.getMotionMatrix();		
	
	// TODO add matrix stack		
	g.objects.ground.reset()
	g.objects.ground.rotateX(toRad(90))
}


function updateCoord(val)
{
	var rnd = Math.random()
	var shift = 0
	if (rnd > 0.90)
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



function MoveObjectToCell(curObjects, row, col)
{		
	// i made a mistake somewhere and don't know exactly why swapped col and row
	var groundHeight = g.objects.ground.getHeight(col, row);
	// "-" because z is reversed
	var boxHeight = -groundHeight / boxScale + 1;
	
	// TODO get from ground
	var cellSize = 1	
	var objectLen = 2
	
	// lift cube to a half of it size and set initial pos as 0
	// translate to 0 0
	curObjects.translate( [objectLen/2, boxHeight, objectLen/2])
	curObjects.translate( [objectLen * (row  - (cellCount / 2)), 0, objectLen * ( col - (cellCount / 2))])
}

var x = 0
var y = 0
function UpdateObjects(){	
	g.objects.cubes[0].getShader().enable()	
	for (var idx = 0; idx < g.objects.cubes.length; ++idx){		
		var curObject = g.objects.cubes[idx]		
		
		// TODO replace to matrix stack		
		curObject.reset()		
				
		curObject.scale([boxScale, boxScale, boxScale])			
	
		// it is not a view part, because it is a part of model
		position = Positions[idx]
		position.x = updateCoord(position.x)
		position.y = updateCoord(position.y)		
		
		MoveObjectToCell(curObjects, position.y, position.x)				
	}	
}

function GameModel(){
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
  var n = [winx,winy,winz,1] 
  mat4.multiplyVec4(invMat,n,n); 
  
  return [n[0]/n[3],n[1]/n[3],n[2]/n[3]] 
} 

function getGroundZeroPos(MVPMatrix)
{
	var viewport = [0, 0, gl.viewportWidth, gl.viewportHeight]
	var invertedY = gl.viewportHeight - mouseAttrs.mousePos.y
	var invertedX = /*gl.viewportWidth - */mouseAttrs.mousePos.x


	var mat =  mat4.identity(mat4.create());

	var perspMat = mat4.create();
	mat4.perspective( perspMat, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
	
	var near = unproject(invertedX, invertedY, 0, MVPMatrix, viewport)
	var far = unproject(invertedX, invertedY, 1, MVPMatrix, viewport)	
	var diff_vec = vec3.create();
	
	vec3.subtract(diff_vec, far, near)	
	vec3.normalize(diff_vec, diff_vec)
	
	var t = -near[2] / diff_vec[2];	
	// x , y in zero pos
	return [(near[0] + diff_vec[0] * t), (near[1] + diff_vec[1] * t)]
}

function DrawGroundPosObjects()
{	
	if (mouseAttrs.isPressed)
	{
		return
	}
	
	var VPMatrix =  g.camera.getProjViewMatrix()
	var MVPMatrix = mat4.identity(mat4.create())
	
	// Apply horizontal ground model
	mat4.rotateX(MVPMatrix, VPMatrix, Math.PI * 90 / 180.)

	var zeroPos = getGroundZeroPos(MVPMatrix)
	
	DrawGroundCross(MVPMatrix, zeroPos)
	DrawGroundCube(MVPMatrix, zeroPos)
}

function DrawGroundCube(MVPMatrix, zeroPos)
{
	groundCube.getShader().enable()
	var scaleKoef = 0.1	
	var crossMatrix = groundCube.getMotionMatrix()	
	mat4.identity(crossMatrix);		
	mat4.multiply(crossMatrix, MVPMatrix, crossMatrix);		
	mat4.scale(crossMatrix, crossMatrix, [scaleKoef, scaleKoef, scaleKoef]);			
	
	var invScale = 1./scaleKoef	
	
	var shift = [ invScale * zeroPos[0], 
				  invScale * zeroPos[1],
				  0
				]

	mat4.translate(crossMatrix, crossMatrix, shift);
	
	groundCube.draw();
}

function DrawGroundCross(MVPMatrix, zeroPos)
{
	var scaleKoef = 0.1	
	var crossMatrix = groundCross.getMotionMatrix()	
	mat4.identity(crossMatrix);		
	mat4.multiply(crossMatrix, MVPMatrix, crossMatrix);		
	mat4.scale(crossMatrix, crossMatrix, [scaleKoef, scaleKoef, scaleKoef]);			
	
	var invScale = 1./scaleKoef	
	
	var shift = [ invScale * zeroPos[0], 
				  invScale * zeroPos[1],
				  0
				]

	mat4.translate(crossMatrix, crossMatrix, shift);
	groundCross.getShader().enable()
	groundCross.draw();
}

var moveDist = [0, -0.5, -3]

function toRad(grad){	
	return grad * Math.PI / 180
}

function arrayToRad(grad){	
	return [toRad(grad[0]), toRad(grad[1]) , toRad(grad[2])]
}


var FixedAngle = 1

function setupCamera(){
	if (FixedAngle){
		global_angle = 90
	}
	else{
		global_angle = (global_angle + 0.3) % 360;
	}
	
	moveDist[2] = mouseAttrs.zoom / 10;	
	
	g.camera.reset()
	g.camera.translate(moveDist)
	g.camera.rotate(arrayToRad(mouseAttrs.rotationAngle))
	g.camera.rotateY(toRad(global_angle))
}

function update()
{	
	gl.clearColor(.2, .2, .2, .8);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	setupCamera()
	
	UpdateGround()	
	UpdateObjects()
	
	g.scene.render(g.camera)
	// ToTHink - render pipeline	
	
	
	//DrawObjects()
	
	//DrawGroundPosObjects()
		
	//DrawGround()		
}


