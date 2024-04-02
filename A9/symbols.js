const width = 300;
const height = 300;

const svg = d3.select("body").append("svg").attr("viewBox", `0 0 ${width} ${height}`);

const projection = d3.geoEquirectangular();

const path = d3.geoPath()
    .projection(projection);

const mapData = new Map();

Promise.all([
    d3.json("./data/states.json"),
    d3.csv("./data/expensive-states.csv", d => {
        mapData.set(d.State, {lat: parseFloat(d.Latitude) ,long: parseFloat(d.Longitude), cost: parseFloat(d.housingCost)});
    })
]).then(loadData => {
    let topo = loadData[0];
    console.log(loadData[1]);

    const top10 = ["HI", "CA", "NY", "OR", "MA", "AK", "MD", "CT", "NJ", "RI"];

    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", d => top10.includes(d.properties.name)?"yellow":"white")
        .style("stroke-width", 0.1)
        .append("title")
        .text(d => {
            return `${d.properties.name}`;
        });

    const states = Array.from(mapData.keys());

    svg.selectAll("circle")
        .data(states)
        .enter()
        .append("circle")
        .attr("cx", d => projection([mapData.get(d).long, mapData.get(d).lat])[0])
        .attr("cy", d => projection([mapData.get(d).long, mapData.get(d).lat])[1])
        .attr("r", d => mapData.get(d).cost * 0.01)
        .style("fill", "red")
        .style("stroke", "red")
        .style("stroke-width", 0.01)
        .style("opacity", 0.70)
        .append("title")
        .text(d => {
            return `Cost of housing in ${d}: ${mapData.get(d).cost}`;
        });

})