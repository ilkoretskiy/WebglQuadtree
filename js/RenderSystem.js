RenderComponent.prototype.render(MVPMatrix, shaderProgram, verteciesCount){
	var uMVPMatrix = shaderProgram.getUniform("uMVPMatrix")
	gl.uniformMatrix4fv(uMVPMatrix, false, MVPMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, verteciesCount);
}


inherit(RenderSystem, System)

function RenderSystem(){
    System.call(this)
}

RenderSystem.prototype.update = function(){
    mat4 VPMatrix = CameraPosition.getViewProjMatrix();
    
    for (entity in entities){
        ModelPositionComponent modelposition = entity.GetComponent(ModelPosition);
        var pos = modelPosition.getPos()

        height = heightMap.getHeighAtPoint(pos)

        //x and y in modelcoord, height in relative for ground
        var WorldMatrix = translateToWorld(pos.x, pos.y, height)

        var MVPMatrix = mat4.create()
        mat4.multiply(MVPMatrix, WorldMatrix, VPMatrix)

		MaterialComponent material = entity.GetComponent(Material)
		ShapeComponent shape = entity.GetComponent(Shape)
		Shader shader = takeShader...
		
        RenderComponent render = GetComponent(render);        
        
        shader.enable()
        
        material.apply()        
        shape.apply()
        
        render.draw(MVPMatrix, shader, shape.verteciesCount)
        
        shape.disable()
        material.disable()
    }	
}
