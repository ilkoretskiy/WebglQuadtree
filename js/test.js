var cube = new Entity()
var cubeShapeComponent = new CubeShapeComponent()
var cubeMaterial = new WireframeMaterial(CubeWireframe, 0x00FF00)
var shader = ShaderManager.getPogram('wireframe')

cube.setComponent(new ModelPositionComponent())
cube.setComponent(cubeShapeComponent)
cube.setComponent(cubeMaterial)
// now shader depends strongle on the material and i don't know how to split it
cube.setComponent(shader)



Pipeline = [
	PositionSystem,
	RenderSystem
]

update(){
	var dt = 1;
	for (var i = 0; i < Pipeline.length; ++i){
		var system = Pipeline[i];
		system.update(dt)
	}
	
	
	PositionComponent posComp =  EntityManager.getComponent("position", 0);
	var x = posComp.getX()
	var y = posComp.getY()
}
