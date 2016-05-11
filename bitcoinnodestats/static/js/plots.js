
var create_plot = function(json_filepath, title) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 60, right: 20, bottom: 50, left: 60},
        width = 800 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
    var bisectDate = d3.bisector(function(d) { return d.datetime; }).left;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(8);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.datetime); })
        .y(function(d) { return y(d.y); });

    // Adds the svg canvas
    var svg = d3.select("body").select("#plot")
        .append("svg")
            .attr("id", title)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


    // Get the data
    d3.json(json_filepath, function(json) {
        var data = json.points;
        data.forEach(function(d) {
            d.datetime = parseDate(d.datetime);
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.datetime; }));
        y.domain([0, d3.max(data, function(d) { return d.y + 1; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Append marker
        svg.selectAll(".marker")
          .data(data)
          .enter().append("circle")
          .attr("class", "marker")
          .attr("r", 3)
          .attr("cx", function(d) { return x(d.datetime); })
          .attr("cy", function(d) { return y(d.y); });

          // append the rectangle to capture mouse
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        // focus is based on http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
        var focus = svg.append("g")
            .style("display", "none");

        // append the circle at the intersection
        focus.append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke-width", 3)
            .style("stroke", "white")
            .attr("r", 6);

        // place the value at the intersection
        focus.append("text")
            .attr("class", "y1")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "-.3em");

        focus.append("text")
            .attr("class", "y2")
            .attr("dx", 8)
            .attr("dy", "-.3em");

        // place the date at the intersection
        focus.append("text")
            .attr("class", "y3")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "1em");

        focus.append("text")
            .attr("class", "y4")
            .attr("dx", 8)
            .attr("dy", "1em");

        function mousemove() {
            var data2 = data;
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data2, x0, 1),
                d0 = data2[i - 1],
                d1 = data2[i],
                d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;

            focus.select("circle.y")
                .attr("transform",
                      "translate(" + x(d.datetime) + "," +
                                     y(d.y) + ")");

            var formatDate = d3.time.format("%d %b %H:%M");

            var tooltip_x = x(d.datetime) + 15;
            var tooltip_y = y(d.y) + 30;
            var translate_str = "translate(" + tooltip_x + "," + tooltip_y + ")";

            focus.select("text.y1")
                .attr("transform", translate_str)
                .text(Math.round(d.y));

            focus.select("text.y2")
                .attr("transform", translate_str)
                .text(Math.round(d.y));

            focus.select("text.y3")
                .attr("transform", translate_str)
                .text(formatDate(d.datetime));

            focus.select("text.y4")
                .attr("transform", translate_str)
                .text(formatDate(d.datetime));
        }

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .style("fill", "steelblue")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("text")      // text label for the x axis
            .attr("x", width / 2 )
            .attr("y",  height + margin.bottom )
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(json['xlabel']);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .style("fill", "steelblue")
            .call(yAxis);

        svg.append("text")      // text label for the x axis
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2 )
            .attr("y", - margin.left )
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(json['ylabel']);

        svg.append("text")
            .attr("x", width / 2 )
            .attr("y", "-1em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "1.5em")
            .text(json['title']);
    });
};

create_plot("/static/media/connections.json", "connections")
create_plot("/static/media/data_sent.json", "data_sent")
create_plot("/static/media/data_received.json", "data_received")
create_plot("/static/media/upload_speed.json", "download_speed")
create_plot("/static/media/download_speed.json", "upload_speed")