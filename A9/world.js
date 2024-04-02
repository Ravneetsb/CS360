const width = 1000;
const height = 1000;

const svg = d3.select("body").append("svg").attr("viewBox", `0 0 ${width} ${height}`);

const projection = d3.geoEquirectangular();

const path = d3.geoPath()
    .projection(projection);

const mapData = new Map();

Promise.all([
    d3.json("./data/countries.json"),
    d3.csv("./data/development.csv", d => {
        mapData.set(d.Country, +d.Status);
    })
]).then(loadData => {
    let topo = loadData[0];
    console.log(loadData[1]);

    const scale = d3.scaleLinear()
        .domain([0, 1])
        .range(["orange", "green"]);

    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", d => {
            // return mapData.get(d.properties.name) === 1?"green":"orange"
            return scale(mapData.get(d.properties.name));
        })
        .style("stroke-width", 0.5)
        .attr("transform", `translate(50, 60)`)
        .append("title")
        .text(d => {
            return `${d.properties.name}`;
        });

    const title = svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", 50)
        .text("Developed and Developing Countries (2015)")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");

    const legend = d3.legendColor().scale(scale)
        .title("Country Status")
        .cells([0, 1]);

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(50, 450)")
        .call(legend);

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function(event) {
            svg.selectAll('path')
                .attr('transform', event.transform);
        });

    svg.call(zoom);

})