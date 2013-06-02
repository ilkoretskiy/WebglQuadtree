test("Interpolation", function ()
	{	
		var t = new T();
		var initialMap = [
			[0, 0, 1, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		];
		
		
		var resultMapSize = {'width':10, 'height':10};
		
		outputMap = resample(initialMap, resultMapSize)

		ok(true)
	}
);


function T()
{
	this.foo();
}

T.prototype.foo = function(){
}
