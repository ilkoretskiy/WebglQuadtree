function GenerateShip(isMain)
{	
	var textureH =  221;//hardcode
	var shipOffset = 10;		
	
	var ship = new Entity();
	
	var animationComponent = new WaveAnimationComponent(20, 5, 1);

	var textureComponent = new TextureComponent(g.ctx, g.resources["mainship"])	
	ship.addComponent(textureComponent);
		
	var startPosition = {'x' : GenerateNearCenter(g.worldSize.width), 'y' : GenerateNearCenter(g.worldSize.height)};
	
	var cubeShapeComponent = new CubeShapeComponent(g.worldCtx);
	ship.addComponent(cubeShapeComponent);
	
	// TODO make it more obvious
	ship.addComponent(
		new ShaderComponent(g.worldCtx, g.shaderManager.getProgram('wireframeSolid'))
	);
	
	// we know that we wanna take a 0.2 of an original size
	var scaleCoef = 0.2
	
	// and calculate how mush bigger(or smaller) then scaled world
	var relatedScale = scaleCoef / g.worldScaleCoef;
	var motionComponent = new MotionComponent();//
	motionComponent.scale([scaleCoef, scaleCoef, scaleCoef]);
	
	console.log(relatedScale)
	motionComponent.translate([-g.worldSize.width / (2 * relatedScale), 5, -g.worldSize.height / (2 * relatedScale)]);
	ship.addComponent( motionComponent );
	//var animationComponent = new WaveAnimationComponent(20, 8, 30);
	//ship.addComponent(animationComponent);
	
	if (isMain){
		var mainCharacterComponent = new MainCharacterComponent();
		ship.addComponent(mainCharacterComponent);
		
		//ship.addComponent(new ManualPositionComponent(g.worldSize, startPosition));
		ship.addComponent(new BasicPositionComponent(g.worldSize, startPosition));
	}
	else {
		ship.addComponent(new BasicPositionComponent(g.worldSize, startPosition));
	}

	g.entityManager.registerEntity(ship);	
}
// |   v   c   v   |
function GenerateNearCenter(length)
{
	return Math.random() * length / 2 + length / 4;
}
