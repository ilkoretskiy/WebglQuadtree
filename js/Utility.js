function Clamp(val, minVal, maxVal){
	return  Math.max(minVal, Math.min(val, maxVal));
}

//**************************************************************
function resample(map, resultSize){
	var outputMap = []
	for (var row = 0; row < resultSize.height; ++row){
		//output.push()
		var line = []
		for (var col = 0; col < resultSize.width; ++col){
			line.push(getNearestInterpVal(map, col, row, resultSize));
		}
		outputMap.push(line)
	}	
	return outputMap;
}

//**************************************************************
function getNearestInterpVal(map, x, y, maxSize){
	var relX = x / maxSize.width;
	var relY = y / maxSize.height;
	
	var mapHeight = map.length;
	var mapWidth = map[0].length;
	
	var intXPart = Math.floor(relX * mapWidth)
	var frX = relX * mapWidth - intXPart; // fraction x part
	var invFrX = 1. - frX;	
	var right = Clamp(intXPart + 1, 0, mapWidth - 1);
	
	var intYPart  = Math.floor(relY * mapHeight) 
	var frY = relY * mapHeight - intYPart; // fraction y part
	var invFrY = 1. - frY;
	var bottom = Clamp(intYPart + 1, 0, mapHeight - 1);
	
	var lt = map[intYPart][intXPart];
	var lb = map[bottom][intXPart];
	var rt = map[intYPart][right];
	var rb = map[bottom][right];
	
	return Clamp((invFrX * invFrY * lt + 
	frX * invFrY * rt + 
	invFrX * frY * lb + 
	frX * frY * rb), 0, 1 );
}

//**************************************************************
function GetRatioVal(val1, val2){
	return Math.min(val1, val2) / Math.max(val1, val2);
}

//**************************************************************
function pointInRect(point, rect){
	return (point.x >= rect.left && 
			point.x <= rect.right && 
			point.y >= rect.top &&
			point.y <= rect.bottom
			)
}

//**************************************************************
function LoadImage(name, path){
	var image = new Image();
	image.src = path;
	g.resources[name] = image;
}

