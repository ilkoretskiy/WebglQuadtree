/*
********************************************************************************
********************************************************************************
*/

/// Components list
///
/// I don't know how exactly this list will be use

function EntityManager(){
	//this.componentEntityLinks = new Array()
	
	// map from component's family id to list of subscribed entities
	this.componentsMap = {}
	
	this.components = new Array();
	// i don't know how to get count of entries in dict, in another language change to Dict
	this.entitiesList = new Array();
	this.lastGeneratedID = -1;
}


EntityManager.prototype.registerComponent = function(component){
	this.components.push(component)
    this.componentsMap[component.FAMILY_ID] = []
}

EntityManager.prototype.getComponents = function(){
	return this.components;
}

EntityManager.prototype.registerSystem = function(system){

}

EntityManager.prototype.getEntitiesWithComponent = function(componentFamilyId){
    // i don't know how to resolve getting of unexist item, maybe it will be undefiend    
    var entities = this.componentsMap[componentFamilyId];
    return entities;
}

EntityManager.prototype.registerEntity = function(object){
	// Add only unregistered entities
	if (object.getID() == -1)
	{
		var newID = this.generateID();
		object.setID(newID);
		this.entitiesList[newID] = object
	}
	else
	{
		return;
	}
		
    var componentsList = object.getComponents();
    //console.log("registerEntity", componentsList)
    for (var key in componentsList)
    {
		var component = componentsList[key]
		// TODO now i must register every new objects, but in future i want to make a "clone" function
        // TODO add some checking for ID collision
        // we know that pushing of new item will be successfully if component registered already
        if (typeof this.componentsMap[component.FAMILY_ID] === 'undefined')
        {
			console.log("can't add ", component.FAMILY_ID, component.COMPONENT_ID, " because it is unregistered")
		}
		else
		{
			this.componentsMap[component.FAMILY_ID].push(object)
		}
	}  
}

EntityManager.prototype.generateID = function()
{
	this.lastGeneratedID = this.lastGeneratedID + 1
	return this.lastGeneratedID;
}

EntityManager.prototype.getEntities = function()
{
	return this.entitiesList;
}

