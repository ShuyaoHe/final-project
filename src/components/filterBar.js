import * as d3 from 'd3';

function FilterByClass(_){

  let _w;
	let _h;
  let _r;
  let _color;
  let _pie;
  let _arc;
  let _padAngle;

  let tradeData;

  function exports(tradesByImporter, tradesByExporter, tradesByClass){
    _w = _.clientWidth;
    _h = _.clientHeight;
    _r = _w/2;
    _color = d3.scaleOrdinal(d3.schemeSpectral[11]);
    _padAngle = .03;

    tradeData = tradesByClass
      .map(function(d){
        return{
          key: d.key,
          volume:d.values.length
        }
      });

    //create arc data for us given a list of values
    const _pie = d3.pie()
      .startAngle(0*Math.PI)
      .endAngle(2*Math.PI)
      .padAngle(_padAngle)
      .value((d) => { return d.volume; })(tradeData);

    const _arc =d3.arc()
       .innerRadius(_r-30)
       .outerRadius(_r);

    //append DOM elements
    const root = d3.select(_);

		let svg = root//svg & .class
			.selectAll('.filter-layer-svg')
			.data([1])
		svg = svg.enter().append('svg')
			.attr('class','filter-layer-svg')
			.merge(svg)
			.attr('width',_w)
			.attr('height',_h)
			.style('float', 'left')
			.style('top',0)
			.style('left',0);
      // .attr("transform", "translate(" + (_r-380) + "," + (_r-450)+ ")");

    const tradesNodes = svg.selectAll('.trade')
      .data(_pie);//_pie not include tradeData
    console.log(tradesNodes);
		const tradesEnter = tradesNodes.enter()
			.append('g')
			.attr('class','trade')
      .style('float', 'left')
			.style('top',0)
			.style('left',0)
      .attr("transform", "translate(" + _r + "," + _r + ")");
    tradesEnter
      .append("path")
      .attr("d", _arc)
      .attr("fill", function(d, i) {return _color(i);})
      .style("fill-opacity", .35)
      .style("stroke", "lightgrey")
      .style("stroke-width", "1px");
    tradesEnter
      .append('text')
      .style('text-anchor','middle')
			.attr('dy', '.35em')
      .attr("transform", function(d) {
                d.innerRadius = _r-30;
                d.outerRadius = _r;
                return "translate(" + _arc.centroid(d) + ")";})//this gives us a pair of coordinates like [50, 50]
      .style('fill', 'lightgrey')
      .text(d => d.key);

  }
     return exports;

}
  export default FilterByClass;
