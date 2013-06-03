function GenerateShip(isMain)
{	
	var textureH =  221;//hardcode
	var shipOffset = 10;		
	
	var ship = new Entity();
	
	var animationComponent = new WaveAnimationComponent(20, 5, 1);

	var textureComponent = new TextureComponent(g.ctx, g.resources["mainship"])	
	ship.addComponent(textureComponent);
		
	var startPosition = {'x' : GenerateNearCenter(g.worldSize.width), 'y' : GenerateNearCenter(g.worldSize.height)};
	
	var cubeShapeComponent = new CubeShapeComponent();
	ship.addComponent(cubeShapeComponent);
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
