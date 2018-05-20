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

  const _dispatch = d3.dispatch('clickPie');

  function exports(tradesByClass){
    const root = this;
    //console.log(root);
    _w = root.clientWidth;
    _h = root.clientHeight;
    _r = _w/2.5;
    _color = d3.scaleOrdinal(d3.schemeOranges[9]);
    _padAngle = .03;

    console.log(tradesByClass);

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
       .innerRadius(_r-70)
       .outerRadius(_r);

    //append DOM elements


		let svg = d3.select(this)//svg & .class
			.selectAll('.filter-layer-svg1')
			.data([1])
		svg = svg.enter().append('svg')
			.attr('class','filter-layer-svg1')
			.merge(svg)
			.attr('width',_w)
			.attr('height',_h)
			.style('float', 'left')
			.style('top',0)
			.style('left',0)
      .attr("transform", "translate(20,20)");

    const tradesNodes = svg.selectAll('.trade')
      .data(_pie);//_pie not include tradeData
    console.log(tradesNodes);
   //define div for tooltip
    const div = d3.select(this)
      .append("div")
      .attr("class", "tooltip")
      .attr("id","filter-donut")
      .style("opacity", 0)
      .style("position", "absolute")
	    .style("z-index", "10")
	    .style('width','60')
      .style('height','28');


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
      .style("fill-opacity", 1)
      .style("stroke", "lightgrey")
      .style("stroke-width", "1px")
      .on('mouseover', function(d) {
            d3.select(this).style('fill-opacity', .8);

        })
        .on('mouseout', function(d) {
            d3.select(this).style('fill-opacity', 1);

        });

    d3.selectAll('.trade')
      .on("mouseover", function(d) {
            div .transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.data.key)
                .style("left", (d3.event.pageX -80) + "px")
                .style("top", (d3.event.pageY -300) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);});





  }

  exports.on = function(eventType,cb){
    _dispatch.on(eventType,cb);
    return this;
  }
     return exports;

}
  export default FilterByClass;


  export const networkFilter = FilterByClass();
