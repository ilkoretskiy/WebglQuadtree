function MainCharacterComponent()
{
	Component.call(this);
	this.FAMILY_ID = "MainCharacterComponent"
	this.COMPONENT_ID = 0
}

extendObj(MainCharacterComponent, Component)



function ForegroundComponent(initx, inity)
{
	Component.call(this);
	this.FAMILY_ID = "ForegroundComponent"
	this.COMPONENT_ID = 0
	this.x = initx
	this.y = inity
}
extendObj(ForegroundComponent, Component)

ForegroundComponent.prototype.getPos = function(){
	return {'x' : this.x, 'y' : this.y}
}
