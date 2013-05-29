/*
 ******************************************************
 ******************************************************
*/

function AnimationComponent(){
	Component.call(this)
	this.FAMILY_ID = "AnimationComponent"
}
extendObj(AnimationComponent, Component)


function WaveAnimationComponent(amplitude, speed, initPhase){
	AnimationComponent.call(this)
	this.COMPONENT_ID = 1
	this.counter = initPhase;
	this.amplitude = amplitude
	this.speed = speed
	this.x = 0;
	this.y = 0;
}
extendObj(WaveAnimationComponent, AnimationComponent)

WaveAnimationComponent.prototype.update = function(dt){		
    this.y = Math.cos(gradToRad(this.counter)) * this.amplitude;
    this.x = 0;
    this.counter = (this.counter + this.speed) % 360;	
}

WaveAnimationComponent.prototype.getShift = function(){
	return {'x' : this.x , 'y' : this.y};
}
