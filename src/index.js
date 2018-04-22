import * as d3 from 'd3';
import './style/main.css';

import parse from './utils';
import OuterArc from './components/outerArc';
import FilterByClass, {networkFilter} from './components/filterBar';
import FilterByCountry from './components/countryFilter';

const outerArc = OuterArc(document.querySelector('.main'));
//const filterByClass = FilterByClass(document.querySelector('#filter_bar1')).on('clickPie', (d)=>{ console.log(d)});
const filterByCountry = FilterByCountry(document.querySelector('.module#filter_bar2'));


d3.csv('./data/animal_trade.csv',parse)
  .then((trades) => {
    const tradesByClass = d3.nest()
      .key(function(d){return d.class})
      .entries(trades);
    const tradesByImporter = d3.nest()
    .key(function(d){return d.importer})
    .entries(trades);

    const tradesByExporter = d3.nest()
      .key(function(d){return d.exporter})
      .entries(trades);


    const countryMap = d3.map();

    tradesByImporter.forEach(country => {
      countryMap.set(country.key, {
        imports:country.values
      });
    });
    // console.log(countryMap);

    // const joinedData = [];
    tradesByExporter.forEach(country => {

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


  outerArc(trades);
  d3.select('#filter_bar1')
  			.datum(tradesByClass)
  			.each(networkFilter);

  d3.select('#plot')
  			.datum(trades)
  			.each(outerArc);

  networkFilter.on('clickPie', x =>{
    let chosen = x[0].key;
    console.log(chosen);
    outerArc.animal(chosen);

  })
  //getLineData();
// Now I have got data dispatched from filterBar.js
// how to dispatch selected data into OuterArc.js in my situation
// I tried to use  export


// What would be a better data stucture?

// In Histogram.js, you export two functions to draw differnt histogram, why didn't use the same idea on Animation?




  //filterByClass(tradesByClass);
  filterByCountry(countryPoint);

  });
