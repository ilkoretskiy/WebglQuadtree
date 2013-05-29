// such kind of hierarchy look little weird, but i think that every object must be movable
GameObject.prototype = new MovableObject()
GameObject.prototype.constructor = GameObject

function GameObject(){
	MovableObject.call(this)
	this.MVPMatrix = mat4.create()
}

GameObject.prototype.setShader = function(program){	
	this.shaderProgram = program			
	return this
}

GameObject.prototype.getShader = function(){			
	return this.shaderProgram;
}

/*
GameObject.prototype.getMVPMatrix = function(){
	return this.MVPMatrix;
}
*/

GameObject.prototype.draw = function(){
}
