/*RenderComponent.prototype.render = function(MVPMatrix, shaderProgram, verteciesCount){
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
*/


function RenderComponent(){
	Component.call(this)	
	this.FAMILY_ID = "RenderFamily";		
}
extendObj(RenderComponent, Component)

function TextureComponent(ctx, texture){
	RenderComponent.call(this)
	this.ctx = ctx;	
	this.texture = texture;
	this.COMPONENT_ID = "TextureComponent";
}
extendObj(TextureComponent, RenderComponent)

TextureComponent.prototype.update = function(){
	//ctx.drawRect();
}

TextureComponent.prototype.getContext = function(){
	return this.ctx
}

TextureComponent.prototype.getTexture = function(){
	//this.texture.width = "10px"
	//mainShipObj.style.height = 'auto'
	return this.texture
}

//***********************************************************

function BackgroundComponent(image, level){
	Component.call(this)
	this.FAMILY_ID = 'BackgroundComponent';
	this.image = image
	this.level = level
} 

extendObj(BackgroundComponent, Component)

BackgroundComponent.prototype.update = function(){
}

BackgroundComponent.prototype.getContext = function(){
	return this.ctx
}

BackgroundComponent.prototype.getTexture = function(){
	return this.image
}

BackgroundComponent.prototype.getLevel = function(){
	return this.level
}
//***********************************************************

function clamp(val, minv, maxv)
{
	return Math.max( minv, Math.min(val, maxv));
}




