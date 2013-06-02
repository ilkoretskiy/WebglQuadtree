
// it is absolutely the same as MovableObject
function MotionComponent(){
	Component.call(this);
	this.FAMILY_ID = "MotionFamily";
	this.COMPONENT_ID = "MotionComponent";
	
	this.matrix = mat4.identity(mat4.create())
}

extendObj(MotionComponent, Component);

MotionComponent.prototype.reset = function(){
	this.matrix = mat4.identity(this.matrix)
}

MotionComponent.prototype.scale = function(ratioList){	
	mat4.scale(this.matrix, this.matrix, ratioList)			
}
	
MotionComponent.prototype.lookAt = function(eye, center, up){
	mat4.lookAt(this.matrix, eye, center, up)
}

MotionComponent.prototype.translate = function(shift){
	mat4.translate(this.matrix, this.matrix, shift)	
}

MotionComponent.prototype.rotate = function(vec){
	mat4.rotateX(this.matrix, this.matrix, vec[0])
	mat4.rotateY(this.matrix, this.matrix, vec[1])
	mat4.rotateZ(this.matrix, this.matrix, vec[2])
}

MotionComponent.prototype.rotateX = function(angle){
	mat4.rotateX(this.matrix, this.matrix, angle)
}

MotionComponent.prototype.rotateY = function(angle){
	mat4.rotateY(this.matrix, this.matrix, angle)
}

MotionComponent.prototype.rotateZ = function(angle){
	mat4.rotateZ(this.matrix, this.matrix, angle)
}

// i don't know how to make a constraint to update matrices outside of a class
MotionComponent.prototype.getMatrix = function(){
	return this.matrix
}

