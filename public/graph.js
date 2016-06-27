var graph_by_filename = function graph_by_filename(filename, title, loc) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y%m%d").parse;

  var mindate = new Date(2010,1,1),
      maxdate = new Date(2016,6,1);

  var x = d3.time.scale().domain([mindate, maxdate]).range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.low); })
      .y1(function(d) { return y(d.high); });

  var highLine = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.high); });

  var lowLine = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.low); });

  var svg = d3.select(loc)
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.low = +d.low;
      d.high = +d.high;
    });
 
    y.domain([d3.min(data, function(d) { return d.low; }), d3.max(data, function(d) { return d.high; })]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("class", "highLine")
        .attr("d", highLine);

    svg.append("path")
        .datum(data)
        .attr("class", "lowLine")
        .attr("d", lowLine);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
       .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of issues");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
  });
};

var draw_graph = function draw_graph(ward, code, loc) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var mindate = new Date(2009,12,28),
      maxdate = new Date(2016,5,23);

  var x = d3.time.scale().domain([mindate, maxdate]).range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format("d"));

  var area = d3.svg.area()
      .x(function(d) { return x(d.week); })
      .y0(function(d) { return y(d.closed); })
      .y1(function(d) { return y(d.opened); });

  var highLine = d3.svg.line()
      .x(function(d) { return x(d.week); })
      .y(function(d) { return y(d.opened); });

  var lowLine = d3.svg.line()
      .x(function(d) { return x(d.week); })
      .y(function(d) { return y(d.closed); });

  var svg = d3.select(loc)
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var filename = "data/" + code + "-" + ward + ".csv"
  var title = "Ward " + ward

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.week = parseDate(d.week);
      d.closed = +d.closed;
      d.opened = +d.opened;
    });

    y.domain([d3.min(data, function(d) { return d.closed; }), d3.max(data, function(d) { return d.opened; })]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("class", "highLine")
        .attr("d", highLine);

    svg.append("path")
        .datum(data)
        .attr("class", "lowLine")
        .attr("d", lowLine);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of issues");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
  });
};

var graph_by_code = function graph_by_code(code) {
  var dashboard = document.getElementById("dashboard");

  while (dashboard.firstChild) {
    dashboard.removeChild(dashboard.firstChild);
  }

  rows = [1,2,3,4,5,6,7,8,9,10];
  rows.forEach(function(row) {
    var r = dashboard.appendChild(document.createElement("div"));
    r.id = "row" + row;
    r.className = "row";
  });
  
  draw_graph("1", code, "#row1");
  draw_graph("2", code, "#row1");
  draw_graph("3", code, "#row1");

  draw_graph("4", code, "#row2");
  draw_graph("5", code, "#row2");
  draw_graph("6", code, "#row2");

  draw_graph("7", code, "#row3");
  draw_graph("8", code, "#row3");
  draw_graph("9", code, "#row3");

  draw_graph("10", code, "#row4");
  draw_graph("11", code, "#row4");
  draw_graph("12", code, "#row4");

  draw_graph("13", code, "#row5");
  draw_graph("14", code, "#row5");
  draw_graph("15", code, "#row5");

  draw_graph("16", code, "#row6");
  draw_graph("17", code, "#row6");
  draw_graph("18", code, "#row6");

  draw_graph("19", code, "#row7");
  draw_graph("20", code, "#row7");
  draw_graph("21", code, "#row7");

  draw_graph("22", code, "#row8");
  draw_graph("23", code, "#row8");
  draw_graph("24", code, "#row8");

  draw_graph("25", code, "#row9");
  draw_graph("26", code, "#row9");
  draw_graph("27", code, "#row9");

  draw_graph("28", code, "#row10");
  draw_graph("29", code, "#row10");
  draw_graph("30", code, "#row10");
};
