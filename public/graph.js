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

var draw_graph = function draw_graph(type, ward, code, title) {
  if(type == "code") {
    var title = "Ward " + ward,
        filename = "data/" + code + "-" + ward + ".csv",
        link = "/?breakdown=service&ward=" + ward;
  } else if(type == "ward") {
    var title = title,
        link = "/?breakdown=ward&code=" + code;

    if(ward == "all-wards") {
      var filename = "data/all-wards-" + code + ".csv";
    } else {
      var filename = "data/" + code + "-" + ward + ".csv";
    }
  }

  var a = document.createElement("a");
  a.href = link;
  a.className = "graphLink";

  document.getElementById("graphs").appendChild(a);

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

  var svg = d3.select(a)
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.className = "col-md-4 col-sm-6";

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

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      svg.selectAll(".tick").remove();

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
  var graphs = document.getElementsByClassName("col-md-4 col-sm-6");
  for (i = graphs.length - 1; i >= 0; i--) {
    graphs[i].parentNode.removeChild(graphs[i]);
  }

  for (i = 1; i < 31; i++) {
    var ward = i.toString();
    draw_graph(type, ward, code);
  }
};

var graph_by_ward = function graph_by_ward(ward) {
  var type = "ward";
  var graphs = document.getElementsByClassName("col-md-4 col-sm-6");
  for (i = graphs.length - 1; i >= 0; i--) {
    graphs[i].parentNode.removeChild(graphs[i]);
  }

  draw_graph(type, ward, "5743", "Bins for Trash & Recycling");
  draw_graph(type, ward, "122",  "Graffiti");
  draw_graph(type, ward, "6215", "Hangers");

  draw_graph(type, ward, "5185",  "Health Complaints");
  draw_graph(type, ward, "1250",  "Illegal Dumping");
  draw_graph(type, ward, "12386", "Library Issues");

  draw_graph(type, ward, "374",  "Other");
  draw_graph(type, ward, "3018", "Other - city responsibility");
  draw_graph(type, ward, "372",  "Parking Meter");

  draw_graph(type, ward, "121",  "Parking Violation/Abandoned Auto");
  draw_graph(type, ward, "126",  "Parks Request");
  draw_graph(type, ward, "2626", "Policing Issue");

  draw_graph(type, ward, "116",  "Potholes");
  draw_graph(type, ward, "1251", "Private Property Issue");
  draw_graph(type, ward, "1249", "Public Space, Streets and Drains");

  draw_graph(type, ward, "117", "Sidewalks and Curb damage");
  draw_graph(type, ward, "373", "Signs / Bus Shelters / Pavement Markings");
  draw_graph(type, ward, "124", "Street Lamp");

  draw_graph(type, ward, "5251", "Street Sweeping");
  draw_graph(type, ward, "51",   "Traffic Signal / Pedestrian Signal");
  draw_graph(type, ward, "2625", "Traffic/Road Safety");

  draw_graph(type, ward, "1966", "Trash & Recycling");
  draw_graph(type, ward, "1853", "Tree Trimming");
};
