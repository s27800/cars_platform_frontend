import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEST_DATA_DIR = path.join(__dirname, '../.data');
export const TEST_CARS_FILE = path.join(TEST_DATA_DIR, 'cars.json');


export type TestCar = {
  id: string;
  name: string;
};

export type TestCars = {
  first: TestCar;
  second: TestCar;
  third: TestCar;
  all: TestCar[];
  missing: string;
};


export const MISSING_CAR_ID = '00000000-0000-0000-0000-0000000000ff';


let cache: TestCars | null = null;


export function testCars(): TestCars {
  if (cache)
    return cache;

  if (!fs.existsSync(TEST_CARS_FILE)) {
    throw new Error(
      `Test car ids not found at ${TEST_CARS_FILE}.\n` +
      'They are produced by the "setup" project in global-setup.ts. ' +
      'Run the full suite (npm run test:e2e) instead of a single spec, ' +
      'or make sure the backend is reachable so setup can query it.'
    );
  }

  cache = JSON.parse(fs.readFileSync(TEST_CARS_FILE, 'utf-8')) as TestCars;

  return cache;
}


export function writeTestCars(cars: TestCars): void {
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  fs.writeFileSync(TEST_CARS_FILE, JSON.stringify(cars, null, 2));
}
