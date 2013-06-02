
var identityMatrix = mat4.identity(mat4.create());
var precreatedMVPMatrix = mat4.create();

function WorldDrawSystem(entityManager, worldSize)
{	

	this.entityManager = entityManager;
	this.worldSize = worldSize;
	
	console.log(entityManager, worldSize)
	this.posCompID = (new PositionComponent()).getFamilyID();
	this.terrainCompID = (new TerrainComponent()).getFamilyID();		
	this.shaderCompID = (new ShaderComponent()).getFamilyID();
	this.motionComponentID = (new MotionComponent()).getFamilyID();
	this.angle = 0;
}


WorldDrawSystem.prototype.draw = function(gl, camera){
	
	this.drawTerrain(gl, camera);		
}

WorldDrawSystem.prototype.drawTerrain = function(gl, camera){
	var entities = this.entityManager.getEntitiesWithComponent(this.terrainCompID);

	// common matrix from camera
	var projViewMatrix = camera.getProjViewMatrix();

	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		var terrainComp = entity.getComponentByFamilyID(this.terrainCompID);
		
		var motionComponent = entity.getComponentByFamilyID(this.motionComponentID);
		
		var viewMatrix = 0;
		var MVPMatrix = precreatedMVPMatrix;
		
		
		if (typeof motionComponent !== 'undefined'){
			modelMatrix = motionComponent.getMatrix();
			
		}
		else{
			modelMatrix = identityMatrix;
		}
		var rotatedModel = mat4.create();
		
		
		//this.angle =  ( this.angle + 1 ) % 360;
		//mat4.translate
		//mat4.translate(rotatedModel, modelMatrix, [this.worldSize.width / 2, this.worldSize.height / 2, 0])		
		//mat4.rotateX( rotatedModel, rotatedModel, gradToRad(-80))
		//mat4.rotateZ( rotatedModel, rotatedModel, gradToRad(this.angle))
		//mat4.translate(rotatedModel, rotatedModel, [-this.worldSize.width / 2, -this.worldSize.height / 2, 0])
		
		//mat4.multiply(MVPMatrix, projViewMatrix, rotatedModel);
		
		mat4.multiply(MVPMatrix, projViewMatrix, modelMatrix);
		

		var shaderComponent = entity.getComponentByFamilyID(this.shaderCompID); 		
		if (typeof shaderComponent !== 'undefined'){
			var shaderProgram = shaderComponent.getShaderProgram();			
			
			// enable shader
			shaderProgram.enable();
			
			shaderComponent.applyUniform4fv("uMVPMatrix", precreatedMVPMatrix);			
			
			// apply buffers and draw
			terrainComp.draw(shaderProgram, gl);
		}else{
			console.error("object without shader");
		}

	}
}
