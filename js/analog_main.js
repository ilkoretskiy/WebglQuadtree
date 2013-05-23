var g = {}

/*
********************************************************************************
********************************************************************************
*/
function onLoad(){
	Initialize();
	setInterval(UpdateSystem(), 30);
}

function Initialize(){
	g.entityManager = new EntityManager();
	InitializeSystems();
	InitializeComponents();	
	InitializeObjects();
}

function InitializeSystems(){
	g.entityManager.registerSystem(new GameModelSystem());
}



function InitializeComponents(){
	g.entityManager.registerComponent(new BasicPositionComponent());
	g.entityManager.registerComponent(new RandomPositionComponent());
	/*..*/
	
	// test
	{
		var components = g.entityManager.getComponents();
		for (var i = 0; i < components.length)
	}	
}

function InitializeObjects(){
	var cube = new Entity()
	//cube.setComponent(new CubeShapeComponent())	
	cube.addComponent(new BasicPositionComponent())	
	g.entityManager.registerObject(cube)
}

function UpdateSystems(){	
	GameModelSystem.update()
}

/*
********************************************************************************
********************************************************************************
*/
function Entity(){
    this.componentList = new Array();
    this.ID = -1
}


Entity.prototype.addComponent = function(component){
    this.componentList[component.FAMILY_ID] = component // i hope it will create a reference, not a copy
}

Entity.prototype.getComponents = function(){
    return this.componentList;
}

Entity.prototype.setId = function(id){
	this.ID = id
}

Entity.prototype.getId = function(){
	return id
}

/*
********************************************************************************
********************************************************************************
*/
function EntityManager(){
	this.componentEntityLinks = new Array()
}


// I think that there is can be a problem with removing.
we have a lot of components, every of it keep link to object
comp1 -> obj1 obj2 obj3 obj4
comp2 -> obj2 obj3 obj4
comp3 -> obj3
comp4 -> obj1 obj2

EntityManager.prototype.registerObject = function(object){
    var componentsList = object.getComponents();
    for(var i = 0; i < componentsList.length; ++i){
        var component = componentsList[i];
        // set that an entity has a link with this components type
        // TODO now i must register every new objects, but in future i want to make a "clone" function
        // TODO add some checking for ID collision
                
        // Add only unregistered objects
        if (object.getID() != -1)
        {
			var newID = this.generateId();
			object.setID(newID);
			this.componentsList[newID] = object			
			this.componentDictionary[component.FAMILY_ID].push(newID)
		}        
    }
}

EntityManager.prototype.registerComponent = function(component){
	console.log("component.id", component.FAMILY_ID)
    this.componentEntityLinks[component.FAMILY_ID] = []
}

EntityManager.prototype.registerSystem = function(system){

}

EntityManager.prototype.getEntitiesWithComponent = function(componentFamilyId){
    // i don't know how to resolve getting of unexist item, maybe it will be undefiend
    var entities = this.componentEntityLinks[componentFamilyId];
    return entities
}

/*
********************************************************************************
********************************************************************************
*/
function GameModelSystem(){
	this.systemId = "GameModel"
}

GameModelSystem.prototype.update = function(){
	var entities = EntityManager.getEntitiesWithComponent(PositionComponent.FAMILIY_ID);
	
	
	/*	
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		// update position		
		var positionComponent = entity.getComponent(PositionComponent.FAMILIY_ID);
		positionComponent.update();
		console.log(positionComponent);
		

		var renderComponent = entity.getComponent(RenderComponent.ID);
		if (renderComponent){
			renderComponent.update();
		}
		* */
	}
}
