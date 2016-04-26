// グラフの表示領域を設定
var margin = {top: 50, right: 20, bottom: 30, left: 50};
var width = window.innerWidth/10*6.8 - margin.left - margin.right;
var height = window.innerHeight/10*3 - margin.top - margin.bottom;

//　ドラッグのところで使われている
//　いまいちわかっていない
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// スケールと出力レンジの定義
var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// 軸の定義
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// svgの定義
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//　グラフを描画する関数
function drawGraph(statisticsName, articleDate){
  $('#graph svg text').empty();
  //グラフタイトル追加
  d3.select("#graph").select("svg").append('text')
  .attr({
    x:width/2-40, //width/2-font-size
    y:25, //font-size+5
    fill: "black",
    "font-size":20 //ここを変数にする
  })
  .text(function(){
    var counrty = {'close':'合計', 'GIN':'ギニア', 'LBR':'リベリア', 'SLE':'シエラレオネ' ,'NGA':'ナイジェリア' ,'SEN':'セネガル' ,'USA':'アメリカ', 'MLI':"マリ", 'ESP':"スペイン"};
    return "エボラ感染者数―"+counrty[statisticsName];
  });

  $('#graph g').empty();

  // データを読み込む
  d3.csv("data/Total.csv")
  .row(function(d){   // 行単位で読み込んで処理
    // 1行目が日本語なので安全のためラベル名など割り当て直す
    //GIN,LBR,SLE,NGA,SEN,USA
    // 将来的には国の省略語と名前（英語や日本語）が全て対応づくイメージ
    return {date : d.date, close : d["close"], GIN : d["ギニア"], LBR : d["リベリア"], SLE : d["シエラレオネ"], NGA : d["ナイジェリア"], SEN : d["セネガル"], USA : d["アメリカ"], MLI : d["マリ"], ESP : d["スペイン"] }
  })
  .get(function(error, data) {
    var countryNameArray = Object.keys(data[0]);
    // データをフォーマット
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      for(var i=1; i<=countryNameArray.length-1; i++){
        d[countryNameArray[i]] =+ d[countryNameArray[i]];
      }
    });

    // 線の定義
    var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[statisticsName]); });

    var dataMin; //データセットの最小値
    var dataMax; //データ・セットの最大値
    for(var i=0; i<=data.length-1; i++){
      for(var j=2; j<=countryNameArray.length-1; j++){
          if(i==0 && j==2){
              dataMin = data[i][countryNameArray[j]];
              dataMax = data[i][countryNameArray[j]];
          }else if(data[i][countryNameArray[j]] < dataMin){
              dataMin = data[i][countryNameArray[j]];
          }else if(data[i][countryNameArray[j]] > dataMax){
              dataMax = data[i][countryNameArray[j]];
          }
      }
    }

    //　時系列順にソート
    data.sort(function(a, b) {
      return a.date - b.date;
    });

    var scale = d3.scale.linear().domain([dataMin, dataMax]).range([0, 255]);

    var scale1 = d3.scale.linear().domain([dataMin, dataMax]).range([0, 255]);

    // データを入力ドメインとして設定
    // 同時にextentで目盛りの単位が適切になるようにする
    x.domain(d3.extent(data, function(d) { return d.date; })).clamp(true);
    y.domain(d3.extent(data, function(d) { return d[statisticsName]; }));

    // x軸をsvgに表示
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // y軸をsvgに表示
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Casualties (人)");

    // path要素をsvgに表示し、折れ線グラフを設定
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.append("g")
       .attr("class", "icon")
       .attr("clip-path", "url(#clip)")
       .selectAll('.icon')
       .data(articleDate)
       .enter()
       .append('line')
       .attr("x1", function(d) {
          return x(d.date);
       })
       .attr("y1", function(d) {
          return height;
       })
      .attr("x2", function(d) {
          return x(d.date);
       })
       .attr("y2", function(d) {
          return 0;
       })
      .attr("stroke", 'gray')
      .attr("opacity", '0.9');

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

        focus.append("circle")
      .attr("r", 4.5);

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      focus.append("line")
          .attr("x1", 0).attr("x2", 0) // vertical line so same value on each
          .attr("y1", 0).attr("y2", height); // top to bottom


      var dragListener = d3.behavior.drag()
	      .on("dragstart", function() { console.log("dragstart"); })
	      .on("drag", dragmove)
	      .on("dragend", function() { console.log("dragend"); });

      function dragmove() {
          var x0 = x.invert(d3.event.x),
              i = bisectDate(data, x0, 1),
              d0 = data[i - 1],
              d1 = data[i],
              d = x0 - d0.date > d1.date - x0 ? d1 : d0;

          // Translate focus line by mouse coordinates
          focus.attr("transform", "translate(" + x(d.date) + ",0)");
          focus.select("text").text(d.date);

          // Change highlited map region
          for(var j=2; j<=countryNameArray.length-1; j++){
            if(d[countryNameArray[j]] != 0){
              var color = Math.round(scale(d[countryNameArray[j]]));
              var color2 = 255 - Math.round(scale(d[countryNameArray[j]]));
              $('.datamaps-subunit'+'.'+countryNameArray[j]).css('fill','rgb(255, '+color2+', 0)');
            }else{
              $('.datamaps-subunit'+'.'+countryNameArray[j]).css('fill','rgb(171, 221, 164)');
            }
          }

          // Change highlited articles
          if($('.'+Date.parse(d.date)) != null){
              d3.selectAll("li").selectAll("p").style("color", "black");
              $('.'+Date.parse(d.date)).css('color','red');
          }else{
              d3.selectAll("li").selectAll("p").style("color", "black");
          }
      }

      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .call(dragListener);
  });
}