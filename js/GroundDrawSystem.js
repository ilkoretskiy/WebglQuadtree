function WorldDrawSystem(entityManager, worldSize)
{
	this.entityManager = entityManager;
	this.worldSize = worldSize;
	
	this.posCompID = (new PositionComponent()).getFamilyID();
}


WorldDrawSystem.prototype.draw = function(gl, generated){
	
}
