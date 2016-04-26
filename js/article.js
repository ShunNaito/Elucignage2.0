// 日付データのパースを設定
var parseDate = d3.time.format("%Y/%m/%d").parse;

function displayText(){
	// 新聞記事のデータを読み込む
	d3.csv("data/article.csv")
	.row(function(d){   // 行単位で読み込んで処理
    // 1行目が日本語なのでラベル名など割り当て直す
    //GIN,LBR,SLE,NGA,SEN,USA
    // 将来的には国の省略語と名前（英語や日本語）が全て対応づくイメージ
    return {date : d.date, hyodai : d["表題"], text : d.text}
  })
	.get(function(error, data) {
		// データをフォーマット
		data.forEach(function(d) {
			d.date = parseDate(d.date);
		});
		//　新聞記事の本文を表示する
		d3.select("#articlePane").selectAll("li")
			.data(data)
			.enter()
			.append("li")
			.append("p")
			.attr("class",function(d) {
				return Date.parse(d.date);
			})
			.style("font-size",'162.5%')
			.style("text-decoration",'underline')
			.on("click",function(d){
				$('.focus').attr("transform", "translate("+x(d.date)+",0)");
				if($('.'+Date.parse(d.date)) != null){
					d3.selectAll("li").selectAll("p").style("color", "black");
				$('.'+Date.parse(d.date)).css('color','red');
				}else{
					d3.selectAll("li").selectAll("p").style("color", "black");
				}
			})
			.text(function(d) { return d.hyodai; });

			d3.select("#articlePane").selectAll("li")
			.data(data)
			.append("p")
			.text(function(d) { return d.text; });

			//　デフォルトで累計患者数を表示
			drawGraph("close", data);
	});
}