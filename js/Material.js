// i don't sure that this is correct, because if i'll want to add some features to a fragment shader that can draw wireframe(e.g. lighting or a texture) then shader's params will change. 
// I don't know what will be happen in this situation


function WireframeMaterial(wireframeBuffer, color){
    this.wireframeBuffer = wireframeBuffer
    this.color = color
    
    this._aBaricentricId = -1
}

WireframeMaterial.prototype.apply = function(shaderProgram){

    var uColor = shaderProgram.getUniform("uColor")
    gl.uniform4fv(uColor, this.color);

	this._aBarycentricId = shaderProgram.getAttr("aBarycentric");
	gl.enableVertexAttribArray(this._aBarycentricId);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.wireframeBuffer);			
	gl.vertexAttribPointer(aBarycentric, 3, gl.FLOAT, false, 0, 0);
    
}

WireframeMaterial.prototype.disable(){
	gl.disableVertexAttribArray(this._aBarycentricId);
}
