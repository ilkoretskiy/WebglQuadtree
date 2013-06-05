g = {}
g.camera = {}
g.mouseHandler = {}
g.objects = {}
g.resources = {}

var canvas = {}
var ground = {}
var Positions = []

var fullscreen_mode = 1

//**************************************************************
function onLoad(){
	Initilize();
	g.mainLoop = setInterval(UpdateSystem, 30);
}

//**************************************************************
function Initilize(){	
	LoadImages();
	
	g.entityManager = new EntityManager();
	InitCanvas();
	InitShaders()	
	g.worldSize = {'width' : g.mapCanvas.width, 'height' : g.mapCanvas.height};
	InitCamera();
	GenerateMap(g.worldSize);
	InitSystems();
	InitComponents();
	InitEntities();
	
	
}

function InitShaders(){
	g.shaderManager = new ShaderManager(g.worldCtx);
}

//**************************************************************
function InitCanvas(){
	g.mapCanvas = document.getElementById("mapArea");
	g.mapCtx = g.mapCanvas.getContext('2d');	
	
	g.worldCanvas = document.getElementById("worldArea");	
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
	var gl = null;	
	for (var i =0; i < names.length; ++i){
		try {
			gl = g.worldCanvas.getContext(names[i], {antialias : true});			
			gl.viewportWidth = g.worldCanvas.width;
			gl.viewportHeight = g.worldCanvas.height;
		} catch(e) {}
		
		if (gl){
			console.log("success")
			break;
		}
	}
	
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
		
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND)
	
	// At the current moment i don't know exactily meanings of this attributes
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)	
	gl.depthFunc(gl.LESS);
	g.worldCtx = gl
}

var topView = false
//**************************************************************
function InitCamera(  ){
	var gl = g.worldCtx
	g.camera = new Camera(45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)		
	
	if (topView)
	{
		g.camera.translate([0, 0, -30])
		g.camera.rotateX(gradToRad(90))
	}
	else
	{
		g.camera.translate([0, 3, -15])
		g.camera.rotateX(gradToRad(45))	
		g.camera.rotateY(gradToRad(-20))	
	}
}

//**************************************************************
function GenerateMap (worldSize){
	
	var initialMap = [
			
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0.5, 1, 1, 1, 0.2, 0.3, 0.3, 0],
			[0, 0, 0, 0.5, 1, 1, 0.2, 0.3, 0.3, 0],
			[0, 0.5, 0.5, 0.8, 0.8, 0, 0, 0, 0, 0],
			[0, 0.5, 0.5, 0.8, 0.8, 0.8, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			
		];	
		
	g.generatedMap = resample(initialMap, worldSize);
	
	g.map2d = new Map2D(g.mapCtx, g.generatedMap, worldSize);
	g.map3d = new Map3D(g.worldCtx, g.generatedMap, worldSize);
	console.log(worldSize)
}

//**************************************************************
function InitSystems(){
	g.mapSystem = new MapSystem(g.entityManager, g.worldSize, g.map2d.getImage());
	g.worldDrawSystem = new WorldDrawSystem(g.entityManager, g.worldSize);
	g.positionSystem = new PositionSystem(g.entityManager, g.worldSize);	
}

//**************************************************************
function InitComponents(){
	g.entityManager.registerComponent(new PositionComponent());	
	g.entityManager.registerComponent(new MainCharacterComponent());	
	g.entityManager.registerComponent(new RenderComponent());
	g.entityManager.registerComponent(new TerrainComponent());
	g.entityManager.registerComponent(new ShaderComponent());
	g.entityManager.registerComponent(new MotionComponent());	
	g.entityManager.registerComponent(new ShapeComponent());	
}

//**************************************************************
function InitEntities(){
	var scaleFact = 0.1
	g.worldScaleCoef = 0.1

	GenerateShip(true);
	GenerateShip(false);

	var terrain = new Entity();
	terrain.addComponent(new BarycentricTerrainComponent(g.worldCtx, g.map3d));	
	terrain.addComponent(new ShaderComponent(g.worldCtx, g.shaderManager.getProgram('wireframe')));	
	var motionComponent = new MotionComponent();
	
	// set ground horizontally and translate center of ground to 0,0
	//motionComponent.rotateZ(gradToRad(-90));
	motionComponent.rotateX(gradToRad(-90));	
	motionComponent.scale([scaleFact, scaleFact, 2])
	
	
	terrain.addComponent(motionComponent);	
	g.entityManager.registerEntity(terrain);
}

//**************************************************************
function LoadImages(){	
	LoadImage('mainship', "img/ship.png");		
	LoadImage('wave1', "img/wave.png");
	LoadImage('wave2', "img/wave_ver2.png");
	LoadImage('bg_level1', 'img/bg.jpg');
}


//**************************************************************
function UpdateSystem(){
	var canvasSize = {"width" : g.mapCanvas.width, "height" : g.mapCanvas.height};					
	var dt = 1;
	
	clearCanvas();
	
	g.positionSystem.update(dt);
	g.mapSystem.draw(g.mapCtx, canvasSize);	
	//console.log(g.worldDrawSystem)
	
	g.worldDrawSystem.draw(g.worldCtx, g.camera);
	
}

//**************************************************************
function clearCanvas(){
	g.mapCtx.clearRect(0, 0, g.mapCanvas.width, g.mapCanvas.height); 
	g.mapCtx.rect(0, 0, g.mapCanvas.width, g.mapCanvas.height)
	g.mapCtx.fillStyle = 'white';
	g.mapCtx.fill();
	
	//g.worldCtx.clearColor(.2, .2, .2, .8);
	g.worldCtx.clearColor(0, 0, 0, 1);
	g.worldCtx.clear(g.worldCtx.COLOR_BUFFER_BIT | g.worldCtx.DEPTH_BUFFER_BIT)

}


////////////////////////////////////////////////////////////////////////////////////////////////////




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
