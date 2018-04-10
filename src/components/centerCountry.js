import * as d3 from 'd3';

function CenterCountry(_){

  let _w;
	let _h;


  let clickedCountryData;


  function exports(tradesByImporter, tradesByExporter){

    _w = _.clientWidth;
    _h = _.clientHeight;

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



    clickedCountryData = newdata.map(d => {
      const[x,y] = [_w/2, _h/2];
      return{
        x,
        y,
        r:15+ (Math.random())*10,
        ...d
      }
    });

    // append DOM elements
    const root = d3.select(_);

    let svg = root
      .selectAll('.center-layer-svg')
      .data([1])
    svg = svg.enter().append('svg')
      .attr('class', 'center-layer-svg')
      .merge(svg)
      .attr('width',_w)
			.attr('height',_h)
      .style('position','absolute')
			.style('top',0)
			.style('left',0)
      // .attr('transform', 'translate('+ (_w/2) +','+ (_h/2) +')';

    const clickedCountryNodes = svg.selectAll('.clickedCountry')
			.data(clickedCountryData, d=>d.key);
		const clickedCountryEnter = clickedCountryNodes.enter()
			.append('g')
			.attr('class','clickedCountry');

    clickedCountryEnter.append('circle').attr('r', d => d.r)
                  .style('fill','lightblue')
                  .style("fill-opacity", .2);
    clickedCountryEnter
			.merge(clickedCountryNodes)
			.attr('transform', d => `translate(${d.x}, ${d.y})`);

    clickedCountryEnter
      .append('text').text(d => d.country)
      .style('text-anchor','middle')
      .attr('dy', '.35em')
      .style('fill', 'grey');

  }
  return exports;

}
 export default CenterCountry;
