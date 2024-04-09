const width = 1000;
const height = 600;
const marginTop = 50;
const marginBottom = 50;
const marginRight = 120;
const marginLeft = 150;

d3.csv('data/smoking.csv', (d) => {
    return {
        year: d3.timeParse('%Y')(d.Year),
        country: d.Country,
        smokers: d.Total,
    };
}).then((data) => {
    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.year))
        .range([marginLeft, width - marginRight]);

    const y = d3
        .scaleLinear()
        .domain([0, 12])
        .range([height - marginTop, marginBottom]);

    const countries = [
        'China',
        'India',
        'Pakistan',
        'Sri Lanka',
        'World',
    ];

    const color = d3
        .scaleOrdinal()
        .domain(countries)
        .range(['red', 'steelblue', 'green', 'black', 'grey']);

    svg
        .append('g')
        .attr('class', 'axis')
        .attr(
            'transform',
            `translate(0, ${height - marginBottom})`,
        )
        .call(d3.axisBottom(x));

    svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    const nestedData = d3.group(data, (d) => d.country);

    svg
        .selectAll('.path')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', 'path')
        .attr('fill', 'none')
        .attr('stroke', (d) => color(d))
        .attr('stroke-width', 3)
        .attr('d', (d) =>
            d3
                .line()
                .x((d) => x(d.year))
                .y((d) => y(d.smokers))(nestedData.get(d)),
        );

    var legendOrdinal = d3
        .legendColor()
        .shape(
            'path',
            d3.symbol().type(d3.symbolTriangle).size(150)(),
        )
        .shapePadding(10)
        .scale(color);

    svg
        .append('g')
        .attr('class', 'legend')
        .attr(
            'transform',
            `translate(${width - marginRight + 30}, ${marginTop})`,
        )
        .call(legendOrdinal);

    svg
        .append('text')
        .attr('class', 'ylabel')
        .attr('x', -height / 2)
        .attr('y', marginLeft / 2)
        .text('Percentage of population that smokes')
        .attr('transform', 'rotate(-90)')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');

    svg
        .append('text')
        .attr('class', 'xlabel')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .text('Year')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');

    svg
        .append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', marginTop - 10)
        .text('China has the biggest drop in smoking population.')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .style('font-family', 'Arial');
});
