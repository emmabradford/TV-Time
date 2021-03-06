// function getSceneInfo(season, episode) {

//     d3.json("data/all_scripts_raw.json").then(data => {
//         for (let i = 0; i < 170; i++) {
//             let episode = data['DS9']['episode ' + String(i)];
//             let scenes = (episode.split(/\n\[.*\]\n\n/));
//             for (let j = 1; j < scenes.length; j++) {
//                 let scene = scenes[j];
//                 let dialogue = scene.split(/[A-Z]+:/)
//                 dialogue.shift()
//                 const regex = /[A-Z]+:/g;
//                 //Reference string
//                 //Using matchAll() method
//                 let chars = [...scene.matchAll(regex)];
//                 for (let char = 0; char < chars.length; char++) {
//                     console.log(chars[char][0]);
//                 }
//                 break;

//             }

//             break;
//         }
//     })

// }


// create the svg area
const svg = d3.select("#my_dataviz")
    .append("svg")
    // .attr("width", 5000)
    // .attr("height", 5000)
    .append("g")
    .attr("transform", "translate(300,300)")

// create a matrix
const matrix = [[0, 323, 326, 319, 146, 0, 223, 358, 167, 49],
[323, 0, 261, 227, 97, 0, 214, 283, 130, 38],
[326, 261, 0, 240, 98, 0, 202, 285, 142, 50],
[319, 227, 240, 0, 82, 0, 167, 262, 128, 0],
[146, 97, 98, 82, 0, 0, 84, 99, 43, 14],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[223, 214, 202, 167, 84, 0, 0, 203, 101, 31],
[358, 283, 285, 262, 99, 0, 203, 0, 144, 36],
[167, 130, 142, 128, 43, 0, 101, 144, 0, 36],
[49, 38, 50, 0, 14, 0, 31, 36, 36, 0]];


var names = ['SISKO', 'ODO', 'BASHIR', 'DAX', 'JAKE', 'OBRIEN', 'QUARK', 'KIRA', 'WORF', 'EZRI']
//         const colors = ['#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
// '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC']

var color = d3.scaleOrdinal()
    .domain(names)
    .range(d3.schemeCategory10);

//   console.log(colors[0])

// 4 groups, so create a vector of 4 colors
//         const colors = d3.scaleOrdinal()
//   .domain(keys)
//   .range(d3.schemeSet2);


// give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
const res = d3.chord()
    .padAngle(0.09)
    .sortSubgroups(d3.descending)
    (matrix)

// add the groups on the outer part of the circle
svg
    .datum(res)
    .append("g")
    .selectAll("g")
    .data(function (d) { return d.groups; })
    .join("g")
    .append("path")
    .style("fill", (d, i) => color(i))
    .style("stroke", "black")
    .attr("d", d3.arc()
        .innerRadius(200)
        .outerRadius(210) //just try this - may need to shift a little but should be close
    )


    
// Add the links between groups

//tooltip doesn't show up

const showTooltip = function (event, d) {
    console.log(names[d.source.index] + names[d.target.index])
    var tooltip = d3.select('#tooltip')

    tooltip
        .style("opacity", 1)
        .html('Source: ' + names[d.source.index] + ' Target: ' + names[d.target.index])
        // .html(" Target: " +  + "<br>Source: " + )
        .style("left", event.screenX + "px")
        .style("top", event.screnY + "px")

}




// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var hideTooltip = function (d) {
    tooltip
        .transition()
        .duration(1000)
        .style("opacity", 0)
}

svg
    .datum(res)
    .append("g")
    .selectAll("path")
    .data(d => d)
    .join("path")
    .attr("d", d3.ribbon()
        .radius(200) //starting point- may be off by a bit, but should fit
    )
    .style("fill", d => color(d.source.index)) // colors depend on the source group. Change to target otherwise.
    .style("stroke", "black")
    .on("mouseover", showTooltip)
// .on("mouseleave", hideTooltip)


//  svg = d3.select("#my_dataviz")

// Handmade legend

// create a list of keys


// console.log()
// Usually you have a color scale in your chart already
// var color = d3.scaleOrdinal()
//   .domain(keys)
//   .range(d3.schemeSet2);

// Add one dot in the legend for each name.
svg.selectAll("mydots")
    .data(names)
    .enter()
    .append("circle")
    .attr("cx", 200)
    .attr("cy", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) { return color(d) })

// Add one dot in the legend for each name.
svg.selectAll("mylabels")
    .data(names)
    .enter()
    .append("text")
    .attr("x", 230)
    .attr("y", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) { return color(d) })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")


// this group object use each group of the data.groups object
// var group = svg
//     .datum(res)
//     .append("g")
//     .selectAll("g")
//     .data(function (d) {
//         return d.groups;
//     })
//     .enter()


// group.append('text')
//     .attr('transform', function (d) {
//         return 'translate(' +
//             res
//                 // .innerRadius(200)
//                 // .outerRadius(210)
//                 .startAngle(d.startAngle)
//                 .endAngle(d.endAngle)
//                 .centroid() // this is an array, so will automatically be printed out as x,y
//             + ')'
//     })

