import { MapData } from './interfaces/mapData.interface';
import { parseMap } from './services/parseMap/parseMap';
import { exit } from 'process';
import { renderMap } from './services/renderMap/renderMap';

const args = process.argv;
if (args.length < 3) {
  console.log('Please provide a map ID as an argument');
  exit(1);
}

const main = async () => {
  const mapData = (await parseMap(args[2])) as MapData;
  console.log('Map: ', mapData.MapProperties.mapTitle);
  renderMap(mapData);
};

main();
