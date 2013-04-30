//facade between MatrixLibrary and system

function MovableObject(){	
	// actually it is a model matrix, but in Camera it is a view
	// TODO to think about it
	this.viewMatrix = mat4.identity(mat4.create())
}

MovableObject.prototype.reset = function(){
	this.viewMatrix = mat4.identity(this.viewMatrix)
}

MovableObject.prototype.scale = function(ratioList){	
	mat4.scale(this.viewMatrix, this.viewMatrix, ratioList)			
}
	
MovableObject.prototype.lookAt = function(eye, center, up){
	mat4.lookAt(this.viewMatrix, eye, center, up)
}

MovableObject.prototype.translate = function(shift){
	mat4.translate(this.viewMatrix, this.viewMatrix, moveDist)	
}

MovableObject.prototype.rotate = function(vec){
	mat4.rotateX(this.viewMatrix, this.viewMatrix, vec[0])
	mat4.rotateY(this.viewMatrix, this.viewMatrix, vec[1])
	mat4.rotateZ(this.viewMatrix, this.viewMatrix, vec[2])
}

MovableObject.prototype.rotateX = function(angle){
	mat4.rotateX(this.viewMatrix, this.viewMatrix, angle)
}

MovableObject.prototype.rotateY = function(angle){
	mat4.rotateY(this.viewMatrix, this.viewMatrix, angle)
}

MovableObject.prototype.rotateZ = function(angle){
	mat4.rotateZ(this.viewMatrix, this.viewMatrix, angle)
}

// i don't know how to make a prohibiton to update matrices outside of a class
MovableObject.prototype.getViewMatrix = function(){
	return this.viewMatrix
}

