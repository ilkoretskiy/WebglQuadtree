// Draw background
function InputSystem(entityManager){
	this.systemId = "InputSystem"
	this.entityManager = entityManager
	this.mainCharacterComponentFamilyID = (new MainCharacterComponent()).getFamilyID();
	this.positionComponentID = (new PositionComponent()).getFamilyID();
}

InputSystem.prototype.update = function(dt, pressedKeys){
	var mainCharactersEntities = this.entityManager.getEntitiesWithComponent(this.mainCharacterComponentFamilyID);
	if (mainCharactersEntities.length == 0)
		return;
		
	var mainEntity = mainCharactersEntities[0];
	
	var posComp = mainEntity.getComponentByFamilyID(this.positionComponentID);
	var pos = posComp.getPos()
	
	for (var i = 0; i < pressedKeys.length; ++i)
	{
		var e = pressedKeys[i];
		/*W*/
		if ( e.keyCode == 87 ) {		
			
		}
	
		/*S*/
		if ( e.keyCode == 83 ) {
		}
	
		/*A*/
		if ( e.keyCode == 65 ) {
			pos.x -= posComp.speed 
		}
	
		/*D*/
		if ( e.keyCode == 68 ) {
			pos.x += posComp.speed
		}
	
	}
	
	posComp.setPos(pos.x, pos.y)
}

