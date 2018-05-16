import * as d3 from 'd3';
import './style/main.css';

import parse from './utils';
import OuterArc from './components/outerArc';
import FilterByClass, {networkFilter} from './components/filterBar';
import FilterByCountry from './components/countryFilter';

//const filterByClass = FilterByClass(document.querySelector('#filter_bar1')).on('clickPie', (d)=>{ console.log(d)});
// const filterByCountry = FilterByCountry(document.querySelector('.module#filter_bar2'));

Promise.all([
    d3.csv('./data/animal_trade.csv',parse),
  d3.csv('./data/countryName.csv')
]).then((loadData) => {
  const trades = loadData[0];
  const countriesName = loadData[1];

const outerArc = OuterArc(document.querySelector('.main')).getCountryName(countriesName);
    const tradesByClass = d3.nest()
      .key(function(d){return d.class})
      .entries(trades);
    // const tradesByImporter = d3.nest()
    // .key(function(d){return d.importer})
    // .entries(trades);
    //
    // const tradesByExporter = d3.nest()
    //   .key(function(d){return d.exporter})
    //   .entries(trades);
    //
    // const countryMap = d3.map();
    //
    // tradesByImporter.forEach(country => {
    //   countryMap.set(country.key, {
    //     imports:country.values
    //   });
    // });
    //
    // tradesByExporter.forEach(country => {
    //
    //   const c = countryMap.get(country.key);
    //       // console.log(c);
    //
    //   if(!c){
    //     countryMap.set(country.key, {exports:country.values});
    //
    //   }else{
    //     c.exports = country.values;
    //   }
    //   //
    //   // joinedData.push(c);
    // });
    //
    //   const countryPoint = countryMap.entries()
    //     .map(input => {
    //
    //       const output = {};
    //
    //       output.country = input.key;
    //
    //
    //       if(input.value.imports) { output.imports = input.value.imports;}
    //       if(input.value.exports) { output.exports = input.value.exports;}
    //
    //       if(!input.value.imports) {output.exportsum = d3.sum(input.value.exports, d => d.exportQuantity);
    //                                 output.sum = output.exportsum
    //                               }
    //       else if(!input.value.exports) {output.importsum = d3.sum(input.value.imports, d => d.importQuantity); output.sum =output.importsum}
    //       else {output.exportsum = d3.sum(input.value.exports, d => d.exportQuantity);
    //             output.importsum = d3.sum(input.value.imports, d => d.importQuantity);
    //             output.sum = output.exportsum + output.importsum }
    //
    //       return output;
    //
    //     })

//
// console.log(countriesName);
  outerArc(trades);
  d3.select('#filter_bar2')
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



  });
