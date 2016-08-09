var ward_descriptions = { 1: "Downtown (Green)",
  2: "Dwight",
  3: "Hill (North)",
  4: "Hill (Middle)",
  5: "Hill (South)",
  6: "Long Wharf",
  7: "Downtown (East/South)",
  8: "Wooster Square / Mill River",
  9: "East Rock / Fair Haven",
  10: "East Rock (Park)",
  11: "Quinnipiac Meadows",
  12: "Quinnipiac Meadows",
  13: "Fair Haven Heights",
  14: "Fair Haven",
  15: "Fair Haven",
  16: "Fair Haven",
  17: "Annex",
  18: "East Shore",
  19: "Prospect Hill",
  20: "Newhallville",
  21: "Newhallville / Prospect Hill",
  22: "Dixwell / Downtown (North)",
  23: "Dwight",
  24: "Edgewood",
  25: "Westville (East)",
  26: "Westville (West)",
  27: "Amity",
  28: "Beaver Hills",
  29: "Beaver Hills",
  30: "West Rock" };
  

var draw_graph = function draw_graph(type, ward, code, title) {
  var url = window.location.href;
  var start_date = parseUri(url)["queryKey"]["start"],
      end_date = parseUri(url)["queryKey"]["end"];

  var params = [],
      filename = "assets/data/",
      graph_link = null;

  if (start_date == null && end_date == null) {
    start_date = "2010-01-01";
    end_date = "2016-05-31";
  } else {
    params.push("start=" + start_date, "end=" + end_date);
  }

  if (type == "code") {
    title = "Ward " + ward + " - " + ward_descriptions[ward];
    filename += code + "-" + ward + ".csv";
    params.push("breakdown=service", "ward=" + ward);
    graph_link = "ward";
  } else if (type == "ward") {
    params.push("breakdown=ward", "code=" + code);
    graph_link = "code";

    if (ward == "all-wards") {
      filename += "all-wards-" + code + ".csv";
    } else {
      filename += code + "-" + ward + ".csv";
    }
  }

  var a = document.createElement("a");
  a.className = "graphLink";

  $(a).click(function() {
    history.replaceState({}, "", "?" + params.join("&"));

    if (graph_link == "code") {
      update_link(code);
      graph_by_code(code);
    } else if (graph_link = "ward") {
      update_link(ward);
      graph_by_ward(ward);
    }
  });

  document.getElementById("graphs").appendChild(a);

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var mindate = new Date(start_date),
      maxdate = new Date(end_date);

  var x = d3.time.scale().domain([mindate, maxdate]).range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .ticks(5)
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
  
  svg.className = "col-sm-6 col-md-4";

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    data = _.filter(data, function(d) {
      return d.week >= start_date && d.week <= end_date;
    });

    data.forEach(function(d) {
      d.week = parseDate(d.week);
      d.opened = +d.opened;
      d.closed = +d.closed;
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
  var graphs = document.getElementById("graphs");
  while (graphs.hasChildNodes()) {
    graphs.removeChild(graphs.lastChild);
  }

  for (i = 1; i < 31; i++) {
    var ward = i.toString();
    draw_graph(type, ward, code);
  }
};

var graph_by_ward = function graph_by_ward(ward) {
  var type = "ward";
  var graphs = document.getElementById("graphs");
  while (graphs.hasChildNodes()) {
    graphs.removeChild(graphs.lastChild);
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
