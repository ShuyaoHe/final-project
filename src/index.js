import * as d3 from 'd3';
import './style/main.css';

import parse from './utils';
import OuterArc from './components/outerArc';
import FilterByClass from './components/filterBar';
import CenterCountry from './components/centerCountry';

const outerArc = OuterArc(document.querySelector('.main'));
const filterByClass = FilterByClass(document.querySelector('.module#filter_bar'));
const centerCountry = CenterCountry(document.querySelector('.main'));


d3.csv('./data/animal_trade.csv',parse)
  .then((trades) => {
    const tradesByClass = d3.nest()
      .key(function(d){return d.class})
      .entries(trades);
    console.log(tradesByClass);


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

    const joinedData = [];
    tradesByExporter.forEach(country => {
      const c = countryMap.get(country.key);

      if(!c){
        countryMap.set(country.key, {exports:country.values});

      }else{
        c.exports = country.values;
      }
      joinedData.push(c);
    });

    console.log(joinedData);

    const randomX = d3.randomNormal(1000 / 2, 80);
    const randomY = d3.randomNormal(1000 / 2, 80);
    const setXYMap = Object.keys(countryMap).forEach(key => {
        const[x,y] = [randomX(), randomY()];
        return{
          x,
          y
            }});

    // console.log(countryMap.keys());
    const countryData = countryMap.keys();
    console.log(countryData);




  outerArc(countryMap, tradesByImporter, tradesByExporter, tradesByClass);
  filterByClass(tradesByImporter, tradesByExporter, tradesByClass);
  centerCountry(tradesByImporter, tradesByExporter);

  });
