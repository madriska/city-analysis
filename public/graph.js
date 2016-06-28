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

var draw_graph = function draw_graph(type, ward, code, loc, title) {
  if(type == "code") {
    var title = "Ward " + ward;
    var filename = "data/" + code + "-" + ward + ".csv";
  } else if(type == "ward" && ward == "all-wards")  {
    var title = title;
    var filename = "data/" + "all-wards-" +  + code + ".csv";
  } else {
    var title = title;
    var filename = "data/" + code + "-" + ward + ".csv";
  }

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

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.week = parseDate(d.week);
      d.closed = +d.closed;
      d.opened = +d.opened;
    });

    var total_issues = d3.max(data, function(d) { return d.opened; });

    if(total_issues < 20) {
      svg.append("text")
          .attr("x", (width / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .text(title);

      svg.append("text")
          .attr("x", (width / 2))
          .attr("y", (height / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Graph omitted due to low issue count (< 20 total)");

      return;
    }

    y.domain([d3.min(data, function(d) { return d.closed; }), total_issues]);

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
  var type = "code";
  var graphs = document.getElementsByTagName("svg");
  for (i = graphs.length - 1; i >= 0; i--) {
    graphs[i].parentNode.removeChild(graphs[i]);
  }

  draw_graph(type, "1", code, "#row1");
  draw_graph(type, "2", code, "#row1");
  draw_graph(type, "3", code, "#row1");

  draw_graph(type, "4", code, "#row2");
  draw_graph(type, "5", code, "#row2");
  draw_graph(type, "6", code, "#row2");

  draw_graph(type, "7", code, "#row3");
  draw_graph(type, "8", code, "#row3");
  draw_graph(type, "9", code, "#row3");

  draw_graph(type, "10", code, "#row4");
  draw_graph(type, "11", code, "#row4");
  draw_graph(type, "12", code, "#row4");

  draw_graph(type, "13", code, "#row5");
  draw_graph(type, "14", code, "#row5");
  draw_graph(type, "15", code, "#row5");

  draw_graph(type, "16", code, "#row6");
  draw_graph(type, "17", code, "#row6");
  draw_graph(type, "18", code, "#row6");

  draw_graph(type, "19", code, "#row7");
  draw_graph(type, "20", code, "#row7");
  draw_graph(type, "21", code, "#row7");

  draw_graph(type, "22", code, "#row8");
  draw_graph(type, "23", code, "#row8");
  draw_graph(type, "24", code, "#row8");

  draw_graph(type, "25", code, "#row9");
  draw_graph(type, "26", code, "#row9");
  draw_graph(type, "27", code, "#row9");

  draw_graph(type, "28", code, "#row10");
  draw_graph(type, "29", code, "#row10");
  draw_graph(type, "30", code, "#row10");
};

var graph_by_ward = function graph_by_ward(ward) {
  var type = "ward";
  var graphs = document.getElementsByTagName("svg");
  for (i = graphs.length - 1; i >= 0; i--) {
    graphs[i].parentNode.removeChild(graphs[i]);
  }

  draw_graph(type, ward, "5743", "#row1", "Bins for Trash & Recycling");
  draw_graph(type, ward, "122", "#row1", "Graffiti");
  draw_graph(type, ward, "6215", "#row1", "Hangers");

  draw_graph(type, ward, "5185", "#row2", "Health Complaints");
  draw_graph(type, ward, "1250", "#row2", "Illegal Dumping");
  draw_graph(type, ward, "12386", "#row2", "Library Issues");

  draw_graph(type, ward, "374", "#row3", "Other");
  draw_graph(type, ward, "3018", "#row3", "Other - city responsibility");
  draw_graph(type, ward, "372", "#row3", "Parking Meter");

  draw_graph(type, ward, "121", "#row4", "Parking Violation/Abandoned Auto");
  draw_graph(type, ward, "126", "#row4", "Parks Request");
  draw_graph(type, ward, "2626", "#row4", "Policing Issue");

  draw_graph(type, ward, "116", "#row5", "Potholes");
  draw_graph(type, ward, "1251", "#row5", "Private Property Issue");
  draw_graph(type, ward, "1249", "#row5", "Public Space, Streets and Drains");

  draw_graph(type, ward, "117", "#row6", "Sidewalks and Curb damage");
  draw_graph(type, ward, "373", "#row6", "Signs / Bus Shelters / Pavement Markings");
  draw_graph(type, ward, "124", "#row6", "Street Lamp");

  draw_graph(type, ward, "5251", "#row7", "Street Sweeping");
  draw_graph(type, ward, "51", "#row7", "Traffic Signal / Pedestrian Signal");
  draw_graph(type, ward, "2625", "#row7", "Traffic/Road Safety");

  draw_graph(type, ward, "1966", "#row8", "Trash & Recycling");
  draw_graph(type, ward, "1853", "#row8", "Tree Trimming");
};
