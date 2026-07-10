import fs from 'fs';
import path from 'path';
import { airportScenario } from '../src/lib/mock/airport';
import { hospitalScenario } from '../src/lib/mock/hospital';
import { warehouseScenario } from '../src/lib/mock/warehouse';

const dataDir = path.join(__dirname, '../../backend/data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'airport.json'), JSON.stringify(airportScenario, null, 2));
fs.writeFileSync(path.join(dataDir, 'hospital-er.json'), JSON.stringify(hospitalScenario, null, 2));
fs.writeFileSync(path.join(dataDir, 'warehouse-hub.json'), JSON.stringify(warehouseScenario, null, 2));

console.log('Successfully exported scenarios to backend/data/');
