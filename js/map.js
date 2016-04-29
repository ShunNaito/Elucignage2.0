var map = {};

map.createDatamap = function(id, type) {
    var buildSetProjection = function(center, rotate, scale) {
	var setProjection = function(element) {
	    var projection = d3.geo.equirectangular()
		    .center(center)
		    .rotate(rotate)
		    .scale(scale)
		    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
	    var path = d3.geo.path()
		    .projection(projection);
	    return {path: path, projection: projection};
	};
	return setProjection;
    };

    var setProjection;
    if (type == "africa") {
		setProjection = buildSetProjection([20, 5], [4.4, 0], 230);
    }else if (type == "usa") {
		setProjection = buildSetProjection([-115, 35], [4.4, 0], 230);
    }

    var map = new Datamap({
		element: document.getElementById(id),
		scope: "world",
		setProjection: setProjection
    });
    return map;
};

map.create = function(stats) {
    var afcicaMap = map.createDatamap("africa", "africa");
    var usaMap = map.createDatamap("usa", "usa");

    $(".datamaps-subunit").click(function() {
	var classNames = $(this).attr("class");
	var country = classNames.split(' ')[1];

	graph.create(country, stats);
    });
};

map.highlightCountry = function(d){
	scale = d3.scale.linear().domain([dataMin, dataMax]).range([0, 255]);
    scale1 = d3.scale.linear().domain([dataMin, dataMax]).range([0, 255]);
	// var countryNameArray = Object.keys(d);
	// Change highlited map region
	for(var j=2; j<=countryNameArray.length-1; j++){
        if(d[countryNameArray[j]] != 0){
        	//var color = Math.round(scale(d[countryNameArray[j]]));
        	var color2 = 255 - Math.round(scale(d[countryNameArray[j]]));

        	$('.datamaps-subunit'+'.'+countryNameArray[j]).css('fill','rgb(255, '+color2+', 0)');
        }else{
        	$('.datamaps-subunit'+'.'+countryNameArray[j]).css('fill','rgb(171, 221, 164)');
        }
    }
}
