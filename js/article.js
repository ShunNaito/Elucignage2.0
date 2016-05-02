// 記事オブジェクト
var articles = {};

// 記事を生成する関数
articles.create = function(articles) {
	//記事の表題を生成する処理
    d3.select("#articlePane").selectAll("li")
	.data(articles)
	.enter()
	.append("li")
	.append("p")
	.attr("class",function(d) {
	    return Date.parse(d.date);
	})
	.style("font-size",'162.5%')
	.style("text-decoration",'underline')
	.on("click",function(d){
		graph.highlightDate(d.date);
		if($('.'+Date.parse(d.date)) != null){
			d3.selectAll("li").selectAll("p").style("color", "black");
		$('.'+Date.parse(d.date)).css('color','red');
		}else{
			d3.selectAll("li").selectAll("p").style("color", "black");
		}
		map.highlightSelectArea(d.area);
	})
	.text(function(d) { return d.hyodai; });
    
	//記事の表題を生成する処理
	d3.select("#articlePane").selectAll("li")
	.data(articles)
	.append("p")
	.text(function(d) { return d.text; });

	graph.addAnnotation(articles);
};

// 記事をハイライトする関数
articles.highlightArticles = function(date) {
	// Change highlited articles
	if($('.'+Date.parse(date)) != null){
		d3.selectAll("li").selectAll("p").style("color", "black");
		$('.'+Date.parse(date)).css('color','red');
	}else{
		d3.selectAll("li").selectAll("p").style("color", "black");
	}
};
