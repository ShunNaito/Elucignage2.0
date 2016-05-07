// マップオブジェクト
var map = {};

// 地図を生成する関数
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

	// type（地域）から生成する地図の中心座標を設定
    var setProjection;
    if (type == "africa") {
		setProjection = buildSetProjection([20, 5], [4.4, 0], 230);
    }else if (type == "usa") {
		setProjection = buildSetProjection([-115, 35], [4.4, 0], 230);
    }

    // 地図の要素やスコープなどを設定
    var map = new Datamap({
		element: document.getElementById(id),
		scope: "world",
		setProjection: setProjection
    });
    return map;
};

// 地図の表示とグラフへアクセスする機能の追加
map.create = function(stats) {
    var afcicaMap = map.createDatamap("africa", "africa");
    var usaMap = map.createDatamap("usa", "usa");

    for(var j=2; j<=countryNameArray.length-1; j++){
			$('.datamaps-subunit'+'.'+countryNameArray[j]).click(function() {
			var classNames = $(this).attr("class");
			var country = classNames.split(' ')[1];
			graph.create(country, stats);
			articles.countryHighlight(country);
	    });
	}
};

// 地図上の国をハイライトする関数
map.highlightCountry = function(d){
	scale = d3.scale.linear().domain([dataMin, dataMax]).range([0, 255]);
	// Change highlited map region
	for(var j=2; j<=countryNameArray.length-1; j++){
        if(d[countryNameArray[j]] != 0){
        	var color2 = 255 - Math.round(scale(d[countryNameArray[j]]));
        	$('.datamaps-subunit'+'.'+countryNameArray[j]).css('fill','rgb(255, '+color2+', 0)');
        }else{
        	$('.datamaps-subunit'+'.'+countryNameArray[j]).css('fill','rgb(171, 221, 164)');
        }
    }
}

var katakanaToInitial = function (str) {
    var strInitial = str
    .replace(/アメリカ/g, 'USA')
    .replace(/シエラレオネ/g, 'SLE')
    .replace(/リベリア/g, 'LBR')
    .replace(/スペイン/g, 'ESP')
    .replace(/ギニア/g, 'GIN');
    return strInitial
};

// 国の周りに表示される枠線は前の選択された国の枠線を消すほうが望ましい
// 現在の実装は全て消すようになっている
map.highlightSelectArea = function(area) {
	if(area != ""){
		initialArea = katakanaToInitial(area);
		for(var i=2; i<=countryNameArray.length-1; i++){
			$('.datamaps-subunit'+'.'+countryNameArray[i]).css('stroke','rgb(255, 255, 255)');
		}
		$('.datamaps-subunit'+'.'+initialArea).css('stroke','rgb(255, 0, 0)');
	}else{
		for(var i=2; i<=countryNameArray.length-1; i++){
			$('.datamaps-subunit'+'.'+countryNameArray[i]).css('stroke','rgb(255, 255, 255)');
		}
	}
}
