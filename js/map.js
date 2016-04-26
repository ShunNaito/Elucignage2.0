function createDatamap(id, type) {
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
}

var afcicaMap = createDatamap("africa", "africa");
var usaMap = createDatamap("usa", "usa");

$(function(){
	// データを読み込む
	d3.csv("data/Total.csv")
	.row(function(d){   // 行単位で読み込んで処理
		// 1行目が日本語なので安全のためラベル名など割り当て直す
		//GIN,LBR,SLE,NGA,SEN,USA
		// 将来的には国の省略語と名前（英語や日本語）が全て対応づくイメージ
		return {date : d.date, close : d["close"],GIN : d["ギニア"], LBR : d["リベリア"], SLE : d["シエラレオネ"], NGA : d["ナイジェリア"], SEN : d["セネガル"], USA : d["アメリカ"], MLI : d["マリ"], ESP : d["スペイン"] }
	})
	.get(function(error, data) {
		var countryNameArray = Object.keys(data[0]);
		for(var j=2; j<=countryNameArray.length-1; j++){
			$('.datamaps-subunit'+'.'+countryNameArray[j]).click(function(){
				var eventClass = event.target.className;
				var tmp =eventClass.animVal.replace( /datamaps-subunit /, '' );
				d3.csv("data/article.csv", function(error, data) {
					// データをフォーマット
					data.forEach(function(d) {
						d.date = parseDate(d.date);
					});
				drawGraph(tmp, data);
				});
			});
		}
	});
});