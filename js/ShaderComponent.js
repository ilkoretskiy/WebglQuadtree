function ShaderComponent(gl, shaderProgram){
	Component.call(this);
	this.FAMILY_ID = "ShaderFamily"
	this.COMPONENT_ID = "ShaderComponent"
	this.shaderProgram = shaderProgram
	this.gl = gl
}

extendObj(ShaderComponent, Component)

ShaderComponent.prototype.getShaderProgram = function(){
	return this.shaderProgram
}

ShaderComponent.prototype.applyUniform4fv = function(name, matrix){
	var uMatrix = this.gl.getUniformLocation(this.shaderProgram.program, name);
	this.gl.uniformMatrix4fv(uMatrix, false, matrix);
}


