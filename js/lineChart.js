class LineChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 200,
            margin: { top: 10, bottom: 30, right: 50, left: 50 }
        }
        this.data = _data;
        console.log(this.data);
        //console.log(this.data2);
        // Call a class function
        this.ylabel;
        this.title;
        this.initVis();

    }

    initVis() {
        // console.log("inside line");
        let vis = this;
        // console.log(vis.data);
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xValue = d => d.year;
        vis.yValue = d => d.value;
        vis.tp = '#tooltip5';

        vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
        vis.colorPalette.domain("percent", "max", "median", "daysaqi");

        vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, vis.xValue)) 
        .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
        .domain([0, d3.max(vis.data, d => d.value)])
        .range([vis.height, 0])
            .nice();
        //console.log('made scales');

        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`)
            .call(vis.xAxis);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        

        vis.keysAll = [];
        vis.data.forEach(d => {
            //console.log(d);
            vis.keysAll.push(d.type)
        });
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        vis.keys = vis.keysAll.filter(onlyUnique);
        // console.log(vis.keysAll);
        // console.log(vis.keys);

        // vis.svg.selectAll("mydots")
        //     .data(vis.keys)
        //     .enter()
        //     .append("circle")
        //     .attr("cx", 500)
        //     .attr("cy", function (d, i) { return 10 + i * 25 })
        //     .attr("r", 4)
        //     .style("fill", function (d) { return vis.colorPalette(d) })

        // // Add one dot in the legend for each name.
        // vis.svg.selectAll("mylabels")
        //     .data(vis.keys)
        //     .enter()
        //     .append("text")
        //     .attr("x", 520)
        //     .attr("y", function (d, i) { return 10 + i * 25 })
        //     .style("fill", function (d) { return vis.colorPalette(d) })
        //     .text(function (d) { return d })
        //     .attr("text-anchor", "left")
        //     .style("alignment-baseline", "middle")

        //might not need
        vis.chart.selectAll('path')
            .data([])
            .exit().remove();
        // console.log(vis.data);

        vis.xScale = d3.scaleLinear()
            .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear()
            .domain([0, d3.max(vis.data, d => d.value)])
            .range([vis.height, 0])
            .nice();

        //console.log('made scales');

        vis.groups = d3.group(vis.data, d => d.type)

        vis.area = d3.area()
            .x(d => vis.xScale(vis.xValue(d)))
            .y1(d => vis.yScale(vis.yValue(d)))
            .y0(vis.height)

        vis.chart.append('path')
            .data([vis.data]);

        //console.log('made path');

        vis.yValueM = d => vis.data.filter(d => d.type == "median");

        vis.circles = vis.chart.selectAll('circle')
            .data(vis.data)
            .join('circle') // join rerenders the data that is filered
            // .attr('fill', (d) => vis.colorPalette(d.type))
            .attr('fill', "red")

            .attr('opacity', .8)
            //.attr('stroke', (d) => vis.colorPalette(d.type))
            .attr('stroke', "red")

            .attr('stroke-width', 2)
            .attr('r', 4)
            .attr('cy', (d) => vis.yScale(d.value))
            .attr('cx', (d) => vis.xScale(d.year));;
        // console.log("made circules");

        vis.prevline = vis.chart.selectAll(".line")
            .data(vis.groups)
            .join("path")
            //.attr('stroke', (d) => vis.colorPalette(d[0]))
            .attr('stroke', "red")

            .attr('fill', "none")
            .attr('stroke-width', 2)
            .attr('d', function (d) {
                return d3.line()
                    .x(function (d) { return vis.xScale(d.year); })
                    .y(function (d) { return vis.yScale(d.value); })
                    (d[1])
            });

        //     console.log(vis.prevline._groups[0]);

        vis.chart.selectAll(".line")
            .data(vis.groups)
            .join("path")
            //.attr('stroke', (d) => vis.colorPalette(d[0]))
            .attr('stroke', "red")

            .attr('fill', "none")
            .attr('stroke-width', 2)
            //.attr('d', vis.prevline)
            //.transition()
            .attr('d', function (d) {
                return d3.line()
                    .x(function (d) { return vis.xScale(d.year); })
                    .y(function (d) { return vis.yScale(d.value); })
                    (d[1])
            });

        vis.circles
        .on('mouseover', function (event, d) { 
        
            //create a tool tip
            d3.select(vis.tp)
              .style('opacity', 1)
              .style('z-index', 1000000)
              .html(`
              <div class="tooltip-title">Episode: ${d.year}</div>
              <ul>
                <li> gayness: ${d.value}</li>

              </ul>
            `);        
          })
          .on('mousemove', (event) => {
            //position the tooltip
            d3.select(vis.tp)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px');
          });
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
        //console.log('made chart');
    }

}