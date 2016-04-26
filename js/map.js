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
    } else if (type == "usa") {
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

	console.log(country);
    });
};