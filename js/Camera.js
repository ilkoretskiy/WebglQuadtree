Camera.prototype = new MovableObject()
Camera.prototype.constructor = Camera

function Camera (fovy, aspect, near, far){	
	MovableObject.call(this)
	this.projectionMatrix = mat4.create();	
	mat4.perspective(this.projectionMatrix, fovy, aspect, near, far)
	this.mvpMatrix = mat4.identity(mat4.create());
	this.__isdirty = true
}

Camera.prototype.reset = function(){
	this.__isdirty = true
	MovableObject.prototype.reset.call(this)
}

Camera.prototype.lookAt = function( eye, center, up){
	this.__isdirty = true
	MovableObject.prototype.lookAt.call(this, eye, center, up)
}

Camera.prototype.translate = function(shift){
	this.__isdirty = true
	MovableObject.prototype.translate.call(this, shift)
}

Camera.prototype.rotate = function(vec){
	this.__isdirty = true
	MovableObject.prototype.rotate.call(this, vec)
}

Camera.prototype.rotateX = function(angle){
	this.__isdirty = true
	MovableObject.prototype.rotateX.call(this, angle)
}

Camera.prototype.rotateY = function(angle){
	this.__isdirty = true
	MovableObject.prototype.rotateY.call(this, angle)
}

Camera.prototype.rotateZ = function(angle){
	this.__isdirty = true	
	MovableObject.prototype.rotateZ.call(this, angle)
}

Camera.prototype.getProjectionMatrix = function(){
	return this.projectionMatrix
}


Camera.prototype.getProjViewMatrix = function(){
	if (this.__isdirty){
		mat4.multiply(this.mvpMatrix, this.projectionMatrix, this.viewMatrix)
		this.__isdirty = false
	}
	return this.mvpMatrix
}
