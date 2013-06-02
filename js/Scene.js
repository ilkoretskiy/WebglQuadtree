function Scene()
{
	this._drawableObjects = []
}

Scene.prototype.add = function(drawable){
	// TODO add checking
	this._drawableObjects.push(drawable)
}

Scene.prototype.render = function(camera){
	var projViewMatrix = camera.getProjViewMatrix()
	var drawableObject = {}
	for(var i = 0; i < this._drawableObjects.length; ++i){
		// TODO add grouping by shaders
		drawableObject = this._drawableObjects[i]
		drawableObject.getShader().enable();
		drawableObject.draw(projViewMatrix);
	}
}
