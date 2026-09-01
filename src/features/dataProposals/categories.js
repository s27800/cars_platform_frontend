// The categories a user can propose a change for
export const PROPOSAL_CATEGORIES = [
  { value: 'ENGINE', labelKey: 'engine' },
  { value: 'TRANSMISSION', labelKey: 'transmission' },
  { value: 'CHASSIS', labelKey: 'chassis' },
  { value: 'PERFORMANCE', labelKey: 'performance' },
  { value: 'OUTSIDE_DIMENSIONS', labelKey: 'outsideDimensions' },
  { value: 'INSIDE_DIMENSIONS', labelKey: 'insideDimensions' },
  { value: 'BASIC_INFO', labelKey: 'basicInfo' },
  { value: 'TAGS', labelKey: 'tags' },
];

// Editable fields per category
export const CATEGORY_FIELDS = {
  ENGINE: [
    { name: 'engineCode', labelKey: 'fields.engineCode', type: 'text' },
    { name: 'displacement', labelKey: 'fields.displacement', type: 'number' },
    { name: 'engineType', labelKey: 'fields.engineType', type: 'text' },
    { name: 'maxPower', labelKey: 'fields.maxPower', type: 'number' },
    { name: 'maxPowerRotationSpeed', labelKey: 'fields.maxPowerRpm', type: 'number' },
    { name: 'maxTorque', labelKey: 'fields.maxTorque', type: 'number' },
    { name: 'maxTorqueRotationSpeed', labelKey: 'fields.maxTorqueRpm', type: 'number' },
    { name: 'cylindersNumber', labelKey: 'fields.cylinders', type: 'number' },
    { name: 'valvesNumber', labelKey: 'fields.valves', type: 'number' },
    { name: 'turbo', labelKey: 'fields.turbo', type: 'text' },
  ],
  TRANSMISSION: [
    { name: 'transmissionType', labelKey: 'fields.transmissionType', type: 'text' },
    { name: 'transmissionName', labelKey: 'fields.transmissionName', type: 'text' },
    { name: 'gearsNumber', labelKey: 'fields.gears', type: 'number' },
    { name: 'clutchType', labelKey: 'fields.clutchType', type: 'text' },
  ],
  CHASSIS: [
    { name: 'drive', labelKey: 'fields.driveType', type: 'text' },
    { name: 'suspension', labelKey: 'fields.suspension', type: 'text' },
    { name: 'frontBrakes', labelKey: 'fields.frontBrakes', type: 'text' },
    { name: 'backBrakes', labelKey: 'fields.rearBrakes', type: 'text' },
    { name: 'frontBrakesRadius', labelKey: 'fields.frontBrakesRadius', type: 'number' },
    { name: 'backBrakesRadius', labelKey: 'fields.rearBrakesRadius', type: 'number' },
  ],
  PERFORMANCE: [
    { name: 'maxSpeed', labelKey: 'fields.maxSpeed', type: 'number' },
    { name: 'acceleration0100', labelKey: 'fields.acceleration', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionCity', labelKey: 'fields.cityConsumption', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionRoute', labelKey: 'fields.highwayConsumption', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionMixed', labelKey: 'fields.mixedConsumption', type: 'number', step: '0.1' },
    { name: 'fuelTankCapacity', labelKey: 'fields.fuelTank', type: 'number' },
  ],
  OUTSIDE_DIMENSIONS: [
    { name: 'length', labelKey: 'fields.length', type: 'number' },
    { name: 'width', labelKey: 'fields.width', type: 'number' },
    { name: 'height', labelKey: 'fields.height', type: 'number' },
    { name: 'wheelBase', labelKey: 'fields.wheelbase', type: 'number' },
    { name: 'clearance', labelKey: 'fields.groundClearance', type: 'number' },
  ],
  INSIDE_DIMENSIONS: [
    { name: 'minTrunkSpace', labelKey: 'fields.minTrunkSpace', type: 'number' },
    { name: 'maxTrunkSpace', labelKey: 'fields.maxTrunkSpace', type: 'number' },
    { name: 'heightFromSeatToRoofFront', labelKey: 'fields.frontHeadroom', type: 'number' },
    { name: 'heightFromSeatToRoofBack', labelKey: 'fields.rearHeadroom', type: 'number' },
  ],
  BASIC_INFO: [
    { name: 'doorsNumber', labelKey: 'fields.doors', type: 'number' },
    { name: 'seatsNumber', labelKey: 'fields.seats', type: 'number' },
    { name: 'productionYears', labelKey: 'fields.productionYears', type: 'text' },
    { name: 'description', labelKey: 'fields.description', type: 'text' },
  ],
  TAGS: [],
};

/**
 * Translate a category enum coming from the API.
 * Falls back to the raw value so an unknown category still renders something.
 *
 * @param {string} value - category enum, e.g. 'ENGINE'
 * @param {function} t - a `t` bound to any namespace (the key is fully qualified)
 */
export const getProposalCategoryLabel = (value, t) => {
  const category = PROPOSAL_CATEGORIES.find(item => item.value === value);

  return category ? t(`cars:dataProposal.categories.${category.labelKey}`) : value;
};
