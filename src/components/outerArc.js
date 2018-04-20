import * as d3 from 'd3';

function OuterArc(_){

  let _w;
	let _h;
  let countryData;
  let _lineData;
  let _forceSimulation = d3.forceSimulation();



  //Force layout related
	//const force = d3.forceSimulation();
	//Define some forces
	const collide = d3.forceCollide().radius(d => d.r + 2);
	const radial = d3.forceRadial();

  function exports(trades){
    console.log(_lineData);

    const tradesByClass = d3.nest()
      .key(function(d){return d.class})
      .entries(trades);

    const tradesByImporter = d3.nest()
    .key(function(d){return d.importer})
    .entries(trades);
    console.log(tradesByImporter);
    const tradesByExporter = d3.nest()
      .key(function(d){return d.exporter})
      .entries(trades);


    const countryMap = d3.map();

    tradesByImporter.forEach(country => {
      countryMap.set(country.key, {
        imports:country.values
      });
    });
    console.log(countryMap);

    // const joinedData = [];
    tradesByExporter.forEach(country => {
      // const c = countryMap.get(country.key);
      const c = countryMap.get(country.key);
          // console.log(c);

      if(!c){
        countryMap.set(country.key, {exports:country.values});

      }else{
        c.exports = country.values;
      }
      //
      // joinedData.push(c);
    });

    console.log(countryMap.entries());
    const countryPoint = countryMap.entries()
      .map(input => {

        const output = {};

        output.country = input.key;


        if(input.value.imports) { output.imports = input.value.imports;}
        if(input.value.exports) { output.exports = input.value.exports;}

        if(!input.value.imports) {output.exportsum = d3.sum(input.value.exports, d => d.exportQuantity);
                                  output.sum = output.exportsum
                                }
        else if(!input.value.exports) {output.importsum = d3.sum(input.value.imports, d => d.importQuantity); output.sum =output.importsum}
        else {output.exportsum = d3.sum(input.value.exports, d => d.exportQuantity);
              output.importsum = d3.sum(input.value.imports, d => d.importQuantity);
              output.sum = output.exportsum + output.importsum }
        // if ( typeof input.value.imports ==="undefined") { output.volume = input.value.exports.exportQuantity;}
        // else if ( typeof input.value.exports ==="undefined") { output.volume = input.value.imports.importerQuantity;}
        // else {  output.volume = input.value.exports.exportQuantity + input.value.imports.importQuantity;}


        return output;

      })
      const root = this;
      console.log(root);

    _w = root.clientWidth;
		_h = root.clientHeight;


    //set coordinates and radius for countrynodes
    const randomX = d3.randomNormal(_w / 2, 80);
    const randomY = d3.randomNormal(_h / 2, 80);

    const min = d3.min(countryPoint, d => d.sum);
    const max = d3.max(countryPoint, d => d.sum);
    const linear = d3.scaleLinear()
        .domain([min, max])
        .range([15, 100]);


    // const cr = d3.scaleLinear().domain().range()

    countryData = countryPoint.map((d,i)=> {
      const[x,y] = [randomX(), randomY()];

      return{
        x,
        y,
        r: linear(d.sum),// decided by country trade volumes

        ...d
      }
    });
    console.log(countryData);

    // //append DOM elements


    let svg = d3.select(this)
      .selectAll('.country-layer-svg')
      .data([1])
    svg = svg.enter().append('svg')
      .attr('class', 'country-layer-svg')
      .merge(svg)
      .attr('width',_w)
			.attr('height',_h)
      .style('position','absolute')
			.style('top',0)
			.style('left',0)
      .style('pointer-events','none')
      .attr('transform', 'translate(-50, -50)');

      let canvas = d3.select(this)
			.selectAll('.animation-layer-canvas')
			.data([1]);
		canvas = canvas.enter().append('canvas')
			.attr('class','animation-layer-canvas')
			.merge(canvas)
			.attr('width',_w)
			.attr('height',_h)
			.style('position','absolute')
			.style('top',0)
			.style('left',0)
			.style('pointer-events','none');
		let ctx = canvas.node().getContext('2d');

    const countriesNodes = svg.selectAll('.countryCircle') //tradeNodes to svg.selectAll('.animalclass')
			.data(countryData, d=>d.key);            //.data(d=>d.class,)为什么要id_short？？？
		const countriesEnter = countriesNodes.enter()
			.append('g')
			.attr('class','countryCircle');

    countriesEnter.append('circle').attr('r', d => d.r)
                  .style('fill','lightgrey')
                  .style("fill-opacity", .5);
    countriesEnter
			.merge(countriesNodes)
			.attr('transform', d => `translate(${d.x}, ${d.y})`);

    countriesEnter
      .append('text').text(d => d.country)
      .style('text-anchor','middle')
      .attr('dy', '.35em')
      .style('fill', 'lightgrey');

      countriesNodes.exit().remove();

    function changeColor(){

      countryData.forEach(d => {

      })
    }


    //Initialize/update and compute a force layout from stationData
		radial
			.x(_w/2)
			.y(_h/2)
			.radius(Math.min(_w,_h)/3 - 50);

		_forceSimulation //the simulation
			.force('collide',collide) //
			.force('radial',radial)
			.alpha(1);

		_forceSimulation
			.on('tick', ()=>{
				//each step of the simulation
				countriesEnter
					.merge(countriesNodes)
					.attr('transform', d => `translate(${d.x}, ${d.y})`);
			})
      .on('end', ()=>{
				renderFrame();
			})
			.nodes(countryData);


      function renderFrame() {
        ctx.clearRect(0,0,_w,_h);
    		const linePath2D = new Path2D();
    		const targetPath2D = new Path2D();

      }
}
// Why this doesn't give me the data
    exports.lineData = function(_){
    		if(typeof _lineData == 'undefined') return _lineData;
    		_lineData = _;
    		return this;
    	}

      exports.forceSimulation = function(_){
      		if(typeof _forceSimulation == 'undefined') return _forceSimulation;
      		_forceSimulation = _;
      		return this;
      	}

    return exports;

}

export default OuterArc;


export const getLineData = OuterArc();
