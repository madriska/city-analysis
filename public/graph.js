var graph = function graph(ward, code, loc) { 
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
      .orient("left");

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
