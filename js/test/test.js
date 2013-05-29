test("TestAddComponent", function ()
	{	
		var entityManager = new EntityManager();
		entityManager.registerComponent(new PositionComponent())	
		var registeredComponents = entityManager.getComponents();
		equal(registeredComponents.length, 1)			
	}
);


test( "TestRegisterComponent", function()
	{
		var object = new Entity();
		object.addComponent(new PositionComponent());
		var entityManager = new EntityManager();
		entityManager.registerComponent(new PositionComponent());
		entityManager.registerEntity(object)
		
		var entities = entityManager.getEntities();
		console.log(entities)
		equal(entities.length, 1, "ent count")
	}
);

test("TestSetComponent", function()
	{
		var object = new Entity();
		object.addComponent(new PositionComponent());
		var componentsCount = object.getComponentsCount();
		equal(componentsCount, 1, "comp count must be 1")
	}
);


test( "TestGetObjectByComponents" , function ()
	{
		var entityManager = new EntityManager();
		
		var worldSize = {'width' : 300, 'height' : 100};
		var startPosition = {'x' :  50, 'y' : 0};
		
		var posComponent = new BasicPositionComponent(worldSize, startPosition)
		entityManager.registerComponent(posComponent);
		
		
		var object = new Entity();
		object.addComponent(posComponent);
		entityManager.registerEntity(object)	
		
		// i must get id of component's family, but i don't know how to do it without instancing of component		
		var enitites = entityManager.getEntitiesWithComponent(posComponent.getFamilyID());
		equal(enitites.length, 1)
	}
);

test ("TestUpdateSystem", function() 
	{
		var entityManager = new EntityManager();
		
				
		var worldSize = {'width' : 300, 'height' : 100};
		var startPosition = {'x' :  50, 'y' : 0};
		
		var posComponent = new BasicPositionComponent(worldSize, startPosition)
		entityManager.registerComponent(posComponent);
		
		var object = new Entity();
		object.addComponent(posComponent);
		entityManager.registerEntity(object)	
		
		
		var system = new GameModelSystem(entityManager);		
		
		var dt = 1
		console.log("before system update")
		system.update(dt)
		
		var updatedPos = posComponent.getPos();
		//equal(updatedPos.x, 52)
		//equal(updatedPos.y, 0)
		
		system.update(dt)
		updatedPos = posComponent.getPos();
		//equal(updatedPos.x, 54)
		//equal(updatedPos.y, 0)
		ok(true)
	}
)

function LoadImage(name, path){
			var image = new Image();
			image.src = path;
			g.resources[name] = image;
		}

test ("TestDrawSystem", function() 
	{
		var entityManager = new EntityManager();
		
		var posComponent = new WaveAnimationComponent(30, 3)
		entityManager.registerComponent(posComponent);
		
		var canvas = document.getElementById("drawArea");
		var ctx = canvas.getContext('2d');
	
		var imageObj = new Image();
		imageObj.src = 'img/test.png';
	
		var renderComponent = new TextureComponent(ctx, imageObj);
		entityManager.registerComponent(renderComponent);
		
		var object = new Entity();
		object.addComponent(posComponent);
		object.addComponent(renderComponent);
		entityManager.registerEntity(object)
		
		
		var system = new GameModelSystem(entityManager);
		
		var dt = 1		
		//setInterval(function(){ctx.clearRect(0, 0, canvas.width, canvas.height); system.update(dt);system.draw(ctx);}, 30);		
		ok(true)
	}
)


test ("TestWorldSystem", function() 
	{	
		var canvas = document.getElementById("drawArea");
		var ctx = canvas.getContext('2d');
		
		var entityManager = new EntityManager();		
		var worldSize = {'width' : 300, 'height' : 500};
		
		var posComponent = new BasicPositionComponent(worldSize, {'x':0, 'y':0})
		entityManager.registerComponent(posComponent);
		
		var mainCharacterComponent = new MainCharacterComponent();
		entityManager.registerComponent(mainCharacterComponent);
		
		var animationComponent = new WaveAnimationComponent(20, 5, 1);
		entityManager.registerComponent(animationComponent);
		
		LoadImage('mainship', "img/ship.png");		
				
		var textureComponent = new TextureComponent(g.ctx, g.resources["mainship"])
		entityManager.registerComponent(textureComponent);

		var textureH =  221;//hardcode
		var shipOffset = 10;
		// add several objects to world		
		var shipsCount = 2;		
		for (var i = 0; i < shipsCount ; ++i){
			var ship = new Entity();
			
			console.log(canvas.height - textureH - shipOffset)
			var startPosition = {'x' : i * 150, 'y' : canvas.height - textureH - shipOffset};
			var animationComponent = new WaveAnimationComponent(20, 8, i * 30);
			
			ship.addComponent(new BasicPositionComponent(worldSize, startPosition));
			if (i === 0)
			{
				ship.addComponent(mainCharacterComponent);
			}
			ship.addComponent(textureComponent);
			ship.addComponent(animationComponent);
			console.log(ship)
			entityManager.registerEntity(ship);
		}
		
		LoadImage('wave1', "img/wave.png");
		LoadImage('wave2', "img/wave_ver2.png");
		
		var waveObjHeight = 200; // hardcode		
		var waveAmplitude = 20;
		var foregroundComponent = new ForegroundComponent(0, waveObjHeight + waveAmplitude);
		entityManager.registerComponent( foregroundComponent );
		
		var backgroundDecoratorComponent = new BackgroundDecoratorComponent(0, waveObjHeight + waveAmplitude * 2);
		entityManager.registerComponent( backgroundDecoratorComponent );
		
		var waveTextureComponent = new TextureComponent(g.ctx, g.resources["wave1"])
		var foregroundObject = new Entity();
		foregroundObject.addComponent(backgroundDecoratorComponent);		
		foregroundObject.addComponent(waveTextureComponent);
		foregroundObject.addComponent(new WaveAnimationComponent(waveAmplitude, 4, 0));
		entityManager.registerEntity(foregroundObject)
		
		backgroundDecoratorObject = new Entity();
		backgroundDecoratorObject.addComponent(foregroundComponent);		
		var waveTextureComponent = new TextureComponent(g.ctx, g.resources["wave2"])
		backgroundDecoratorObject.addComponent(waveTextureComponent);
		backgroundDecoratorObject.addComponent(new WaveAnimationComponent(waveAmplitude, 6, 0));
		entityManager.registerEntity(backgroundDecoratorObject)
		
		
		LoadImage('bg_level1', 'img/bg.jpg');
		var bgComp = new BackgroundComponent(g.resources['bg_level1']);
		entityManager.registerComponent(bgComp);
		
		var background = new Entity();
		background.addComponent(bgComp);
		entityManager.registerEntity(background);
		
		var backgroundSystem = new BackgroundSystem(entityManager, worldSize);
		
		var screen = new ScreenSystem(entityManager, worldSize);
		
		var system = new GameModelSystem(entityManager, worldSize);
		// update their positions
		var interval = setInterval()
		// show them on a "map"
		
		var dt = 1
		var interVal = setInterval(
			function(){
				ctx.clearRect(0, 0, canvas.width, canvas.height); 
				ctx.rect(0, 0, canvas.width, canvas.height)
				ctx.fillStyle = 'white';
				ctx.fill();
				
				// update positions of entities
				system.update(dt);
				// update visible part ot the world
				screen.update()
				var visibleRect = screen.getVisiblePart()
				
				
				var canvasSize = {"width" : canvas.width, "height" : canvas.height};				
				backgroundSystem.draw(ctx, canvasSize, visibleRect);				
				system.draw(ctx, canvasSize);
				screen.draw(ctx, canvasSize);
			}, 
			30);	
		ok(true)
	}
)


