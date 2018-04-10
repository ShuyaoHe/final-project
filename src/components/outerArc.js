import * as d3 from 'd3';


function OuterArc(_){

  let _w;
	let _h;

  let countryData;
  let countryData2;

  //Force layout related
	const force = d3.forceSimulation();
	//Define some forces
	const collide = d3.forceCollide().radius(d => d.r + 2);
	const radial = d3.forceRadial();


  function exports(countryMap, tradesByImporter, tradesByExporter, tradesByClass){

    _w = _.clientWidth;
		_h = _.clientHeight;


    const randomX = d3.randomNormal(_w / 2, 80);
    const randomY = d3.randomNormal(_h / 2, 80);

    // const countryData2 = countryMap.map(d=>{

    var map = d3.map(tradesByExporter, function(d){return d.key;});
    let newdata = [];
    for (var i = 0; i < tradesByImporter.length; i++){
      var importer = map.get(tradesByImporter[i].key);
      if (importer){
        var joindata = {
          country:tradesByImporter[i].key,
          values:tradesByImporter[i].values

        }
        newdata.push(joindata);
      }
    };


    countryData = newdata.map(d => {
      const[x,y] = [randomX(), randomY()];
      return{
        x,
        y,
        r:15+ (Math.random()-.5)*5,
        ...d
      }
    });
    console.log(countryData);

    // //append DOM elements
    const root = d3.select(_);

    let svg = root
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
      .style('pointer-events','none');

    const countriesNodes = svg.selectAll('.country') //tradeNodes to svg.selectAll('.animalclass')
			.data(countryData, d=>d.key);            //.data(d=>d.class,)为什么要id_short？？？
		const countriesEnter = countriesNodes.enter()
			.append('g')
			.attr('class','country');

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

    //Initialize/update and compute a force layout from stationData
		radial
			.x(_w/2)
			.y(_h/2)
			.radius(Math.min(_w,_h)/2.5 - 50);
		force //the simulation
			.force('collide',collide) //
			.force('radial',radial)
			.alpha(1);

		force
			.on('tick', ()=>{
				//each step of the simulation
				countriesEnter
					.merge(countriesNodes)
					.attr('transform', d => `translate(${d.x}, ${d.y})`);
			})
			.nodes(countryData);







}
    return exports;

}

export default OuterArc;
