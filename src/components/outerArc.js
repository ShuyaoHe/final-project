import * as d3 from 'd3';

function OuterArc(_){

  let _w;
	let _h;
  let countryData;
  let _lineData;
  let forceSimulation = d3.forceSimulation();
  let locationLookup;
  let  _countrynameData=[];


  //Force layout related
	//const force = d3.forceSimulation();
	//Define some forces
	const collide = d3.forceCollide().radius(d => d.r + 2);
	const radial = d3.forceRadial();

  function exports(trades){
   console.log(_countrynameData);
   const countriesMap = new Map();
   _countrynameData.forEach(function(c) {
     countriesMap.set(c.countrycode, c.Country_Names);
   });
   console.log(countriesMap);

    //data transformation
    const tradesByClass = d3.nest()
      .key(function(d){return d.class})
      .entries(trades);

    const tradesByImporter = d3.nest()
    .key(function(d){return d.importer})
    .entries(trades);

    const tradesByExporter = d3.nest()
      .key(function(d){return d.exporter})
      .entries(trades);
    //get countrynodes' data
    const countryMap = d3.map();

    tradesByImporter.forEach(country => {
      countryMap.set(country.key, {
        imports:country.values
      });
    });
    // console.log(countryMap);
    tradesByExporter.forEach(country => {

      const c = countryMap.get(country.key);

      if(!c){
        countryMap.set(country.key, {exports:country.values});
      }else{
        c.exports = country.values;
      }
    });

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

        return output;

      })
    const root = d3.select(_);

    _w = _.clientWidth;
		_h = _.clientHeight;

    //set coordinates and radius for countrynodes
    const randomX = d3.randomNormal(_w / 2, 80);
    const randomY = d3.randomNormal(_h / 2, 80);

    const min = d3.min(countryPoint, d => d.sum);
    const max = d3.max(countryPoint, d => d.sum);
    const linear = d3.scaleLinear()
        .domain([min, max])
        .range([15, 100]);


    countryData = countryPoint.map((d,i)=> {
      const[x,y] = [randomX(), randomY()];

      return{
        x,
        y,
        r: linear(d.sum),// decided by country trade volumes

        ...d
      }
    });

    // console.log(countryData);
    const filterMap = d3.map(countryData, d => d.country);

    //append DOM elements
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
			.style('left',0);
      // .style('pointer-events','none')
      // .attr('transform','translate(-100, -50)');


      let canvas = root
			.selectAll('.network-layer-canvas')
			.data([1]);
		canvas = canvas.enter().append('canvas')
			.attr('class','network-layer-canvas')
			.merge(canvas)
			.attr('width',_w)
			.attr('height',_h)
			.style('position','absolute')
			.style('top',0)
			.style('left',0)
			.style('pointer-events','none');

		let ctx = canvas.node().getContext('2d');
    // ctx.restore();
    // ctx.save();
    // ctx.translate(-100,-50);


    //Creates Dom elements
    const countriesNodes = svg.selectAll('.countryCircle')
			.data(countryData, d=>d.key);

    //Creats tooltip
    const div = d3.select(this)
      .append("div")
      .attr("class", "tooltip")
      .attr("id","country_circle")
      .style("opacity", 0)
      .style("position", "absolute")
  	  .style("z-index", "10");

		const countriesEnter = countriesNodes.enter()
			.append('g')
			.attr('class','countryCircle');


    countriesEnter.append('circle').attr('r', d => d.r)
                  .style('fill','lightgrey')
                  .style("fill-opacity", .7)
                  .on('mouseover', function(d) {
                        d3.select(this).style('fill-opacity', 1);

                    })
                    .on('mouseout', function(d) {
                        d3.select(this).style('fill-opacity', .7);

                    });
    countriesEnter
			.merge(countriesNodes)
			.attr('transform', d => `translate(${d.x}, ${d.y})`);

    countriesEnter
      .append('text').text(d => d.country)
      .style('text-anchor','middle')
      .style('font-family', 'Helvetica')
      .style('font-weight', 300)
      .attr('dy', '.35em')
      .style('fill', 'rgba(41,41,41)');

      countriesNodes.exit().remove();

     //tooltip
      d3.selectAll('g.countryCircle')
        .on("mouseover", function(d) {
          // console.log(d);
            const ctn = countriesMap.get(d.country);
              div.transition()
                  .duration(200)
                  .style("opacity", .9);
              div.html(ctn + "<br/>"  + "Total Import: " + Math.floor(d.importsum) + "<br/>" +"Total Export: " + Math.floor(d.exportsum))
                  .style("left", (d.x - 100) + "px")
                  .style("top", (d.y - 40) + "px");
              })
          .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);});

      //filter selected class
      let thisClass, classData;
      d3.selectAll('.trade')
        .on('click', (d)=>{

            thisClass = d.data.key;
            console.log(thisClass);
            const selectedClass = tradesByClass.filter((dd)=>{
              return dd.key == thisClass;
            })
            //initialize the color of countryCircle
            d3.selectAll('g.countryCircle').selectAll("circle").style("fill", "rgba(41,41,41)");
            //get clicked circles's data and change color
            var getCircles = d3.selectAll('g.countryCircle')
                 .filter(function(dd) {
                  // console.log(this);
                  let returnThis = false;
                  if(dd["imports"] == undefined || dd["exports"] == undefined) { return false; }
                  dd.imports.forEach(function(thisImport) {
                    if(thisImport.class === thisClass) {
                      returnThis = true;
                    }
                  })
                  dd.exports.forEach(function(thisExport) {
                    if(thisExport.class === thisClass) {
                      returnThis = true;
                    }
                  })
                  return returnThis;
                });
            getCircles.selectAll("circle").style("fill", "rgba(255,255,255)");

            //get Top 5 importers' data
            function compare(property){
                return function(a,b){
                    var value1 = a[property].sum;
                    var value2 = b[property].sum;
                    return value1 - value2;
                }
              }

            classData = trades.filter(d=> d.class==thisClass);
            const importData = d3.nest()
                .key(function(d){return d.importer})
                .rollup(function(v) { return {sum: d3.sum(v, function(d) { return d.importQuantity; }), raw: v }})
                .entries(classData);

            var top5Import = importData.sort((compare('value'))).slice(-5);
            // const exportData = d3.nest()
            //     .key(function(d){return d.exporter})
            //     .rollup(function(v) { return d3.sum(v, function(d) { return d.exportQuantity; }); })
            //     .entries(classData);
            // var top5Export = exportData.sort((compare('value'))).slice(-10);

            console.log(top5Import);
            top5Import.forEach(function(importer) {
              // console.log(importer);
              let cc = d3.selectAll('g.countryCircle').filter(function(c) {
                // console.log(c);
                return c.country === importer.key;
              });
              console.log(cc);
              cc.select("circle").style("fill","rgb(78,100,143)");
            });
            //get Top 5 importers' and corresponding exporters' coordinates
            const imToEx =[];
            top5Import.forEach(d=>{
              const ctr = filterMap.get(d.key);
              const x1 = ctr.x,
                y1 = ctr.y;
               // console.log(x1,y1);
               let expData = d.value.raw;

               expData.forEach(dd=>{ //console.log(dd);
                 const exCood = filterMap.get(dd.exporter);
                 const x0 = exCood.x, y0 = exCood.y;
                 imToEx.push({
                   start: [x0, y0],
                   end: [x1, y1]
                 })
               })

            });
            // imToEx.forEach((d,i) =>{
            // console.log(imToEx[i].start);})

            renderFrame(imToEx);

         });



    //Initialize/update and compute a force layout from stationData
		radial
			.x(_w/2)
			.y(_h/2)
			.radius(Math.min(_w,_h)/3 - 50);

		forceSimulation //the simulation
			.force('collide',collide) //
			.force('radial',radial)
			.alpha(1);

		forceSimulation
			.on('tick', ()=>{
				//each step of the simulation
				countriesEnter
					.merge(countriesNodes)
					.attr('transform', d => `translate(${d.x}, ${d.y})`);

			})
      .on('end', ()=>{
				//renderFrame();
			})
			.nodes(countryData);


      //draw line function
    function renderFrame(imToEx) {
      console.log('drawLine');
        ctx.clearRect(0,0,_w,_h);
        const linePath2D = new Path2D();

        // const x0 = imToEx.start[0], y0 = imToEx.start[1],
        //       x1 = imToEx.end[0], y1 = imToEx.end[1];
        console.log(imToEx);
        imToEx.forEach((d,i) =>{
          // console.log(d);
          const x0 = imToEx[i].start[0], y0 = imToEx[i].start[1],
                x1 = imToEx[i].end[0], y1 = imToEx[i].end[1];


          linePath2D.moveTo(x0,y0);
          linePath2D.lineTo(x1,y1);

          })
          ctx.strokeStyle = 'rgba(255,255,255,.35)';
          ctx.stroke(linePath2D);


    }


}

exports.getCountryName = function(_){
 _countrynameData = _;
  return this;
}
    return exports;



}

export default OuterArc;
