const width = 400;
const height = 400;

const svg = d3.select('body').append('svg')
    .attr("viewBox", "0 0 400 400");

const projection = d3.geoEquirectangular();

const path = d3.geoPath()
    .projection(projection);

const mapdata = new Map();

Promise.all([
    d3.json("./data/big.json"),
    d3.csv("./data/populationEstimates.csv", function(d) {
        mapdata.set(d.Area, d)
    })]).then(function(loadData) {
    let topo = loadData[0];

    const colorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([900, 4000000]);

    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", path
        )
        .style("stroke", "#000")
        .style("stroke-width", 0.05)
        .style("fill", d => {
            if (d.properties?.NAME && mapdata.get(d.properties.NAME)) {
                return colorScale(mapdata.get(d.properties.NAME).Population);
            } else {
                return "gray";
            }
        })
        .attr("class", d => {
            if (d.properties?.NAME) {
                return d.properties.NAME;
            } else {
                return "NO DATA";
            }
        })
        .append("title")
        .text(d => {
            if (d.properties?.NAME && mapdata.get(d.properties.NAME)) {
                return `${d.properties.NAME} has ${mapdata.get(d.properties.NAME).Population} people`;
            } else {
                return "NO DATA";
            }
        })

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function(event) {
            svg.selectAll('path')
                .attr('transform', event.transform);
        });

    svg.call(zoom);

})
