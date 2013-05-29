var mouseAttrs = {}
mouseAttrs.isPressed = false;
mouseAttrs.lastPressedPos = new Point(0, 0);
mouseAttrs.mousePos = new Point(0, 0);

mouseAttrs._diffPos = new Point(0, 0);
mouseAttrs.zoom = -30;
mouseAttrs.rotationAngle = vec3.create();

function connectMouseEvents(hostObject)
{
	// i don't know why, but if i move callbacks to a prototype then attibutes a missing
	hostObject.addEventListener("mousedown", handleMouseDown, false)
	hostObject.addEventListener("mouseup", handleMouseUp, false)
	hostObject.addEventListener("mousemove", handleMouseMove, false)
	hostObject.addEventListener('mousewheel', handleMouseWheel, false);
}

var handleMouseDown = function(e){
	mouseAttrs.mousePos = getCursorPosition(e);
	mouseAttrs.lastPressedPos = mouseAttrs.mousePos;
	mouseAttrs.isPressed = true		
}

var handleMouseMove = function(e){	
	mouseAttrs.mousePos = getCursorPosition(e);
	if (mouseAttrs.isPressed){				
		mouseAttrs._diffPos.x = (mouseAttrs.mousePos.x - mouseAttrs.lastPressedPos.x);
		mouseAttrs._diffPos.y = (mouseAttrs.mousePos.y - mouseAttrs.lastPressedPos.y);
		mouseAttrs.rotationAngle[0] += mouseAttrs._diffPos.y
		mouseAttrs.rotationAngle[1] += mouseAttrs._diffPos.x
		mouseAttrs.lastPressedPos = mouseAttrs.mousePos;
	}else{
	}
}

var handleMouseWheel = function(e){	
	if (e.wheelDelta > 0){
		mouseAttrs.zoom += 1
	}else{
		mouseAttrs.zoom -= 1
	}
}

var handleMouseUp = function(e){
	mouseAttrs.mousePos = getCursorPosition(e);	
	mouseAttrs.isPressed = false;	
}

//copied from quad_tree.js
function getCursorPosition(e){
	if (typeof(e) == 'undefined')
	{
		console.log("error pos" , e)
		return 
	}
	var x;
	var y;
	if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    
    x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

    return (new Point(x, y))
}

function Point(x, y){
	this.x = x
	this.y = y
}
