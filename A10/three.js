const width = 1000;
const height = 800;
const marginTop = 50;
const marginBottom = 50;
const marginRight = 120;
const marginLeft = 150;

d3.csv('data/penguins.csv', (d) => {
    return {
        species: d.Species,
        flipperLen: +d.FlipperLength,
        culmenDep: +d.CulmenDepth,
    };
}).then((data) => {
    const badSvg = d3
        .select('#bad')
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    const badX = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.flipperLen))
        .range([marginLeft, width - marginRight]);

    const badY = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.culmenDep).reverse())
        .range([marginBottom, height - marginTop]);

    badSvg.append('g')
        .attr('class', 'xAxis')
        .attr(
            'transform',
            `translate(0,${height - marginBottom})`,
        )
        .call(d3.axisBottom(badX));


    badSvg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(badY));

    badSvg.selectAll()
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => badX(d.flipperLen))
        .attr('cy', (d) => badY(d.culmenDep))
        .attr('r', 5)
        .attr('fill', "black");

    badSvg.append('text')
        .attr('class', 'ylabel')
        .attr('x', -height / 2)
        .attr('y', marginLeft / 2)
        .text('Culmen Depth')
        .attr('transform', 'rotate(-90)')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');

    badSvg.append('text')
        .attr('class', 'xlabel')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .text('Flipper Length')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');

    const goodSVG = d3.select('#good')
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.flipperLen))
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.culmenDep).reverse())
        .range([marginBottom, height - marginTop]);

    const colorScale = d3.scaleOrdinal()
        .domain(['Gentoo', 'Adelie', 'Chinstrap'])
        .range(['steelblue', 'lightpink', 'green']);

    goodSVG.append('g')
        .attr('class', 'xAxis')
        .attr(
            'transform',
            `translate(0,${height - marginBottom})`,
        )
        .call(d3.axisBottom(x));

    goodSVG.append('g')
        .attr('class', 'yAxis')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    goodSVG.selectAll()
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.flipperLen))
        .attr('cy', (d) => y(d.culmenDep))
        .attr('r', 5)
        .attr('fill', (d) => colorScale(d.species));

    const legend = d3.legendColor()
        .scale(colorScale)
        .title('Penguin Species');

    goodSVG.append('g')
        .attr('class', 'legend')
        .attr(
            'transform',
            `translate(${width - marginRight}, ${height - 200})`,
        )
        .call(legend);

    goodSVG.append('text')
        .attr('class', 'ylabel')
        .attr('x', -height / 2)
        .attr('y', marginLeft / 2)
        .text('Culmen Depth')
        .attr('transform', 'rotate(-90)')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');

    goodSVG.append('text')
        .attr('class', 'xlabel')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .text('Flipper Length')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');

    goodSVG.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', marginTop - 10)
        .text('Gentoo Penguins have clear clustering when comparing Flipper Length and Culmen Depth.')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');
});
