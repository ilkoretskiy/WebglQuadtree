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
	//g.mainInteval = setInterval(UpdateSystems, 30);	
}

function Initialize(){
	g.entityManager = new EntityManager();
	LoadImages()
	InitializeContext();
	InitializeSystems();
	InitializeComponents();	
	InitializeObjects();
}

function LoadImages()
{	
	var mainShipObj = new Image();		
	mainShipObj.src = "img/test.png";	
	g.resources["mainship"] = mainShipObj;
	
	var backgroundObj = new Image();
	backgroundObj.src = "img/bg.jpg";
	g.resources["bg_level1"] = backgroundObj

}

function InitializeContext(){
	g.canvas = document.getElementById("drawArea");
	g.ctx = g.canvas.getContext('2d');	
}

function InitializeSystems(){	
	g.gameModelSystem = new GameModelSystem(g.entityManager);
	g.backgroundSystem = new BackgroundSystem(g.entityManager, g.canvas);
}


function InitializeComponents(){
	var w = g.canvas.width;
	var h = g.canvas.height;	

	g.entityManager.registerComponent(new BasicPositionComponent(w, h));
	g.entityManager.registerComponent(new RandomPositionComponent(w, h));
	g.entityManager.registerComponent(new TextureComponent());
	g.entityManager.registerComponent(new BackgroundComponent());
	g.entityManager.registerComponent(new WaveAnimationComponent(0, 0));
	/*..*/
		
}

function InitializeObjects(){
	var w = g.canvas.width;
	var h = g.canvas.height;	

	var mainShip = new Entity();
	//mainShip.addComponent(new BasicPositionComponent(w, h));
	mainShip.addComponent(new WaveAnimationComponent(/*ampl*/20, /*speed*/3));
	
	/// TODO it can be usefull with calculating of FOV and screen centering
	// f.ex. if we have 2 or more ships, then we must see all 
	// of them and calculating of visible size will be founded on PlayerComponents
	//mainShip.addComponent(new PlayerObjectComponent());
	
	
	mainShip.addComponent(new TextureComponent(g.ctx, g.resources["mainship"]));
	g.entityManager.registerEntity(mainShip)
	
	
	var background = new Entity();	
	background.addComponent(
		new BackgroundComponent(g.resources["bg_level1"])
	)
	g.entityManager.registerEntity(background)	

}

g.x = 0;

function UpdateSystems(){	
	g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
	var dt = 1
	
	// update objects position
	//g.gameModelSystem.update(dt)
	
	// get visible rect
	
	// draw background
	
	// draw objects
	
	g.backgroundSystem.draw(g.ctx, {'x': g.x / 100, 'y' : 0});
	g.x = (g.x + 1) % 100
	/*
	try{
		
	}
	catch(e){
		console.log(e)
		console.error("bg system failed");
		document.write ("Error Message: " + e.message);
		document.write ("<br />");
		document.write ("Error Code: ");
		document.write (e.number & 0xFFFF)
		document.write ("<br />");
		document.write ("Error Name: " + e.name);
		clearInterval(g.mainInteval)
	}
	* */
	/*
	// Draw background
	g.backgroundSystem.update(dt);
	
	
	// Draw objects
	// move all objects
	
	g.gameModelSystem.draw(g.ctx);
	*/
	// draw waves
	
}
