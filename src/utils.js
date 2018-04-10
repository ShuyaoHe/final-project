// import {csv} from 'd3';
export default function(d){
  return{
    taxon:d.Taxon,
    class:d.Class,
    order:d.Order,
    family:d.Family,
    genus:d.Genus,
    importer:d.Importer,
    exporter:d.Exporter,
    importQuantity:+d.Importer_reported_quantity,
    exportQuantity:+d.Exporter_reported_quantity,
    term:d.Term,
    unit:d.Unti,
    purpose:d.Purpose,
  };
}
