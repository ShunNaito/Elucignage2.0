// 日付データのパースを設定
var parseDate = d3.time.format("%Y/%m/%d").parse;

loadArticles("data/article.csv", function(data) {
    articles.create(data);
});

loadStats("data/Total.csv", function(data) {
    map.create(data);
    graph.create(data);
});

function loadArticles(filename, callback) {
    // 新聞記事のデータを読み込む
    d3.csv(filename)
    .row(function(d){   // 行単位で読み込んで処理
	    // 1行目が日本語なのでラベル名など割り当て直す
	    //GIN,LBR,SLE,NGA,SEN,USA
	    // 将来的には国の省略語と名前（英語や日本語）が全て対応づくイメージ
	    return {date : d.date, hyodai : d["表題"], text : d.text}
	  })
    .get(function(error, data) {
		data.forEach(function(d) {
		    d.date = parseDate(d.date);
		});
		//articles.create(data)と処理は同じ
		callback(data);
    });
}

function loadStats(filename, callback) {
    d3.csv("data/Total.csv")
	.row(function(d) {
	    return {date : d.date,
		    close : d["close"],
		    GIN : d["ギニア"],
		    LBR : d["リベリア"],
		    SLE : d["シエラレオネ"],
		    NGA : d["ナイジェリア"],
		    SEN : d["セネガル"],
		    USA : d["アメリカ"],
		    MLI : d["マリ"],
		    ESP : d["スペイン"]};
	}).get(function(error, data) {
		data.forEach(function(d) {
		    d.date = parseDate(d.date);
		});
	    callback(data);
	});
}