import * as d3 from 'd3';

function FilterByCountry(_){

  let _w;
	let _h;
  let _r;
  let _color;
  let _pie;
  let _arc;
  let _padAngle;

  const _dispatch = d3.dispatch('clickCountry');


  function exports(countryPoint){
    _w = _.clientWidth;
    _h = _.clientHeight;
    _r = _w/2.5;
    _color = d3.scaleOrdinal(d3.schemeSpectral[11]);
    _padAngle = .03;



    //create arc data for us given a list of values
    const _pie = d3.pie()
      .startAngle(0*Math.PI)
      .endAngle(2*Math.PI)
      .padAngle(_padAngle)
      .value((d) => { return d.sum; })(countryPoint);

    
    const _arc =d3.arc()
       .innerRadius(_r-30)
       .outerRadius(_r);

    //append DOM elements
    const root = d3.select(_);

		let svg = root//svg & .class
			.selectAll('.filter-layer-svg2')
			.data([1])
		svg = svg.enter().append('svg')
			.attr('class','filter-layer-svg2')
			.merge(svg)
			.attr('width',_w)
			.attr('height',_h)
			.style('float', 'left')
			.style('top',0)
			.style('left',0)
      .attr("transform", "translate(20,0)");


    const tradesNodes = svg.selectAll('.country')
      .data(_pie);//_pie not include tradeData
    console.log(tradesNodes);

    // let div = root
    //   .selectAll("tooltip")
    //   .data([1])
    // div = div.enter().append("div")
    //   .attr("class", "tooltip")
    //   .style("opacity", 0)
    //   .style("position", "absolute")
	  //   .style("z-index", "10")
	  //   .style('width','60')
    //   .style('height','28');

		const tradesEnter = tradesNodes.enter()
			.append('g')
			.attr('class','country')
      .style('float', 'left')
			.style('top',0)
			.style('left',0)
      .attr("transform", "translate(" + _r + "," + _r + ")");
    tradesEnter
      .append("path")
      .attr("d", _arc)
      .attr("fill", function(d, i) {return _color(i);})
      .style("fill-opacity", .35)
      .style("stroke", "grey")
      .style("stroke-width", "1px");


      d3.selectAll('.country')
        .on('click', (d)=>{
          console.log(d);
          })
   }
  exports.on = function(eventType,cb){
		//eventType:string of event type
		//cb:function
	_dispatch.on(eventType,cb);
		return this;
	}

  return exports;

}
 export default FilterByCountry;
