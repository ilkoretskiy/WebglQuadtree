var g = {}
g.canvas = {}
g.ctx = {}
g.gameModelSystem = {}
g.resources = {}

/*
********************************************************************************
********************************************************************************
*/
function onLoad(){
	Initialize();
	g.mainInteval = setInterval(UpdateSystems, 30);	
}

function LoadImage(name, path){
	var image = new Image();
	image.src = path;
	g.resources[name] = image;
}
		
function GenerateShip(isMain)
{	
	var textureH =  221;//hardcode
	var shipOffset = 10;		
	var animationComponent = new WaveAnimationComponent(20, 5, 1);
	var textureComponent = new TextureComponent(g.ctx, g.resources["mainship"])	
	var mainCharacterComponent = new MainCharacterComponent();
		
	var ship = new Entity();			
	var startPosition = {'x' : (Math.random() * 700 + 100), 'y' : g.canvas.height - textureH - shipOffset};
	var animationComponent = new WaveAnimationComponent(20, 8, 30);
	
	
	ship.addComponent(textureComponent);
	ship.addComponent(animationComponent);
	
	if (isMain){
		ship.addComponent(mainCharacterComponent);
		ship.addComponent(new ManualPositionComponent(g.worldSize, startPosition));
	}
	else {
		ship.addComponent(new BasicPositionComponent(g.worldSize, startPosition));
	}

	g.entityManager.registerEntity(ship);	
}


function doKeyDown(e){	
	g.pressedKeys.push(e)
}


function connectKeyboard(host)
{
	host.addEventListener( "keydown", doKeyDown ,  false);
	host.addEventListener( "keypress", doKeyDown , false);
}



function Initialize(){
	InitializeContext();
	
	g.entityManager = new EntityManager();
	g.worldSize = {'width' : g.canvas.width * 2, 'height' : g.canvas.height};
	g.pressedKeys = []
	connectKeyboard(window);
	
	LoadImages()
	
	InitializeSystems();
	InitializeComponents();	
	InitializeObjects();
}

function LoadImages()
{	
	LoadImage('mainship', "img/ship.png");		
	LoadImage('wave1', "img/wave.png");
	LoadImage('wave2', "img/wave_ver2.png");
	LoadImage('bg_level1', 'img/bg.jpg');
}

function InitializeContext(){
	g.canvas = document.getElementById("drawArea");
	g.ctx = g.canvas.getContext('2d');	
}

function InitializeSystems(){	
	//g.gameModelSystem = new GameModelSystem(g.entityManager);
	//g.backgroundSystem = new BackgroundSystem(g.entityManager, g.canvas);
	g.backgroundSystem = new BackgroundSystem(g.entityManager, g.worldSize);	
	g.screenSystem = new ScreenSystem(g.entityManager, g.worldSize);	
	g.gameModelSystem = new GameModelSystem(g.entityManager, g.worldSize);	
	g.inputSystem = new InputSystem(g.entityManager);
}


function InitializeComponents(){
	var w = g.canvas.width;
	var h = g.canvas.height;	

	var waveObjHeight = 200; // hardcode		
	var waveAmplitude = 20;

	var posComponent = new BasicPositionComponent(g.worldSize, {'x':0, 'y':0})
	g.entityManager.registerComponent(posComponent);	
	
	var mainCharacterComponent = new MainCharacterComponent();
	g.entityManager.registerComponent(mainCharacterComponent);	
	
	var animationComponent = new WaveAnimationComponent(20, 5, 1);
	g.entityManager.registerComponent(animationComponent);			
			
	var textureComponent = new TextureComponent(g.ctx, g.resources["mainship"])
	g.entityManager.registerComponent(textureComponent);
	
	var foregroundComponent = new ForegroundComponent(0, waveObjHeight + waveAmplitude);
	g.entityManager.registerComponent( foregroundComponent );
	
	var backgroundDecoratorComponent = new BackgroundDecoratorComponent(0, waveObjHeight + waveAmplitude * 2);
	g.entityManager.registerComponent( backgroundDecoratorComponent );
			
}

function InitializeObjects(){
	
	// add several objects to world				
	var shipsCount = 10;				
	for (var i = 0; i < shipsCount ; ++i){
		GenerateShip(false);
	}	
	GenerateShip(true);
	
	var waveObjHeight = 200; // hardcode		
	var waveAmplitude = 20;
	
	var backgroundDecoratorComponent = new BackgroundDecoratorComponent(0, g.canvas.height - waveObjHeight + waveAmplitude * 2);
	var foregroundComponent = new ForegroundComponent(0, g.canvas.height - waveObjHeight + waveAmplitude);
	
	var waveTextureComponent = new TextureComponent(g.ctx, g.resources["wave1"])
	var foregroundObject = new Entity();
	foregroundObject.addComponent(backgroundDecoratorComponent);		
	foregroundObject.addComponent(waveTextureComponent);
	foregroundObject.addComponent(new WaveAnimationComponent(waveAmplitude, 4, 0));
	g.entityManager.registerEntity(foregroundObject)
	
	backgroundDecoratorObject = new Entity();
	backgroundDecoratorObject.addComponent(foregroundComponent);		
	var waveTextureComponent = new TextureComponent(g.ctx, g.resources["wave2"])
	backgroundDecoratorObject.addComponent(waveTextureComponent);
	backgroundDecoratorObject.addComponent(new WaveAnimationComponent(waveAmplitude, 6, 0));
	g.entityManager.registerEntity(backgroundDecoratorObject)
		

	var bgComp = new BackgroundComponent(g.resources['bg_level1']);
	g.entityManager.registerComponent(bgComp);
	
	var background = new Entity();
	background.addComponent(bgComp);
	g.entityManager.registerEntity(background);
}

function UpdateSystems(){
	ShowDebugInfo();
	var dt = 1
	g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height); 
	g.ctx.rect(0, 0, g.canvas.width, g.canvas.height)
	g.ctx.fillStyle = 'white';
	g.ctx.fill();
	
	g.inputSystem.update(dt, g.pressedKeys)
	g.pressedKeys = []
	
	// update positions of entities
	g.gameModelSystem.update(dt);
	// update visible part ot the world
	g.screenSystem.update(dt);
	
	var visibleRect = g.screenSystem.getVisiblePart()
	
	
	var canvasSize = {"width" : g.canvas.width, "height" : g.canvas.height};				
	g.backgroundSystem.draw(g.ctx, canvasSize, visibleRect);				
	g.gameModelSystem.draw(g.ctx, canvasSize);
	g.screenSystem.draw(g.ctx, canvasSize);
}

function id( name ) {
	return !!( typeof document !== "undefined" && document && document.getElementById ) &&
		document.getElementById( name );
}
		
function ShowDebugInfo()
{
	// print registered components
	var comps = id( "components_log" ) 
	if ( comps ){
		var components = g.entityManager.getComponents();
		comps.innerHTML = 
			"<h1 id='components_count'> Components count : "  + components.length + "</h1>"
			
		for (var i = 0; i < components.length; ++i){
			comps.innerHTML += 
				"<h2 id='components'>"  + components[i].getFamilyID() + "</h2>"
		}
	}
	
	
	// print registered entities
}
