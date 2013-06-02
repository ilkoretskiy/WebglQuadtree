function MainCharacterComponent()
{
	Component.call(this);
	this.FAMILY_ID = "MainCharacterFamily"
	this.COMPONENT_ID = "MainCharacterComponent"
}

extendObj(MainCharacterComponent, Component)



function ForegroundComponent(initx, inity)
{
	Component.call(this);
	this.FAMILY_ID = "ForegroundDecoratorComponent"
	this.COMPONENT_ID = 0
	this.x = initx
	this.y = inity
}
extendObj(ForegroundComponent, Component)

ForegroundComponent.prototype.getPos = function(){
	return {'x' : this.x, 'y' : this.y}
}


function BackgroundDecoratorComponent(initx, inity)
{
	Component.call(this);
	this.FAMILY_ID = "BackgroundDecoratorComponent"
	this.COMPONENT_ID = 0
	this.x = initx
	this.y = inity
}
extendObj(BackgroundDecoratorComponent, Component)

BackgroundDecoratorComponent.prototype.getPos = function(){
	return {'x' : this.x, 'y' : this.y}
}
