import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  IoCarSportOutline,
  IoCogOutline, 
  IoSpeedometerOutline,
  IoSettingsOutline,
  IoResizeOutline,
  IoLayersOutline,
  IoFlashOutline,
  IoChevronBackOutline,
  IoCreateOutline,
  IoGitCompareOutline,
  IoCalendarOutline,
  IoGridOutline,
} from 'react-icons/io5';
import { getCarById } from '../api/cars';
import { useAuth } from '../hooks';
import { Button, Spinner, Badge, Tabs, Alert } from '../components/ui';
import { DataProposalModal } from '../components/shared';
import { ImageGallery, SpecificationSection } from '../features/cars';
import { ReviewsSection } from '../features/reviews';
import { FuelReportsSection } from '../features/fuelReports';
import { getCarDisplayName, getStorageItem, setStorageItem } from '../utils/helpers';
import { MAX_COMPARISON_CARS, STORAGE_KEYS } from '../utils/constants';


const CarDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [showProposalModal, setShowProposalModal] = useState(false);

  const [comparisonCars, setComparisonCars] = useState(() => 
    getStorageItem(STORAGE_KEYS.COMPARISON_CARS, [])
  );

  const { data: car, isLoading, isError, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => getCarById(id),
    enabled: !!id,
  });

  const carName = getCarDisplayName(car) || 'Loading...';
  const isInComparison = comparisonCars.some(c => c.id === parseInt(id));

  const handleToggleComparison = () => {
    let newList;

    if (isInComparison) {
      newList = comparisonCars.filter(c => c.id !== parseInt(id));
    } else {
      if (comparisonCars.length >= MAX_COMPARISON_CARS) {
        alert(`You can compare up to ${MAX_COMPARISON_CARS} cars at a time.`);
        return;
      }
      newList = [...comparisonCars, { id: parseInt(id), name: carName }];
    }

    setComparisonCars(newList);
    setStorageItem(STORAGE_KEYS.COMPARISON_CARS, newList);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <IoCarSportOutline className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Car not found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.response?.status === 404 
              ? "The car you're looking for doesn't exist or has been removed."
              : "Something went wrong while loading car details."
            }
          </p>
          <Button to="/cars" variant="primary">Browse Cars</Button>
        </div>
      </div>
    );
  }

  const { 
    engine, 
    transmission, 
    chassis, 
    performance, 
    outsideDimensions, 
    insideDimensions, 
    images,
    bodyType,
    tags,
    productionYears,
    doorsNumber,
    seatsNumber,
    description,
  } = car;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">

      {/* Breadcrumb navigation */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link 
              to={`/brands/${car.brand?.id}`}
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
            >
              <IoChevronBackOutline className="w-4 h-4" />
              {car.brand?.name}
            </Link>
            <span className="text-neutral-400">/</span>
            <Link 
              to={`/models/${car.model?.id}`}
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {car.model?.name}
            </Link>
            <span className="text-neutral-400">/</span>
            <Link 
              to={`/generations/${car.generation?.id}`}
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {car.generation?.name}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 dark:text-white font-medium truncate">
              {car.name || carName}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Image gallery */}
          <div>
            <ImageGallery images={images || []} carName={carName} />
          </div>

          {/* Car info and actions */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {carName}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {productionYears && (
                  <Badge variant="primary" size="md">
                    <IoCalendarOutline className="w-3.5 h-3.5 mr-1" />
                    {productionYears}
                  </Badge>
                )}
                {bodyType?.name && (
                  <Badge variant="default" size="md">
                    {bodyType.name}
                  </Badge>
                )}
                {engine?.engineType && (
                  <Badge variant="default" size="md">
                    {engine.engineType}
                  </Badge>
                )}
                {chassis?.drive && (
                  <Badge variant="default" size="md">
                    {chassis.drive}
                  </Badge>
                )}
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(tags).map(tag => (
                    <Badge key={tag.id} variant="info" size="sm">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {engine?.maxPower && (
                <QuickSpec 
                  icon={<IoFlashOutline />}
                  label="Power"
                  value={`${engine.maxPower} HP`}
                />
              )}
              {performance?.maxSpeed && (
                <QuickSpec 
                  icon={<IoSpeedometerOutline />}
                  label="Top Speed"
                  value={`${performance.maxSpeed} km/h`}
                />
              )}
              {performance?.acceleration0100 && (
                <QuickSpec 
                  icon={<IoSpeedometerOutline />}
                  label="0-100 km/h"
                  value={`${performance.acceleration0100}s`}
                />
              )}
              {engine?.displacement && (
                <QuickSpec 
                  icon={<IoCogOutline />}
                  label="Engine"
                  value={`${(engine.displacement / 1000).toFixed(1)}L`}
                />
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                {description}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={isInComparison ? 'secondary' : 'primary'}
                onClick={handleToggleComparison}
                leftIcon={<IoGitCompareOutline className="w-5 h-5" />}
              >
                {isInComparison ? 'Remove from Compare' : 'Add to Compare'}
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => setShowProposalModal(true)}
                  leftIcon={<IoCreateOutline className="w-5 h-5" />}
                >
                  Suggest Correction
                </Button>
              )}
            </div>

            {/* Comparison list indicator */}
            {comparisonCars.length > 0 && (
              <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  <strong>{comparisonCars.length}</strong> car{comparisonCars.length > 1 ? 's' : ''} in comparison list.{' '}
                  <Link to="/comparison" className="underline hover:no-underline">
                    View comparison →
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications sections */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <IoSettingsOutline className="w-6 h-6 text-primary-600" />
            Technical Specifications
          </h2>

          <div className="space-y-3">

            {/* Basic Info */}
            <SpecificationSection
              title="Basic Information"
              icon={<IoCarSportOutline className="w-5 h-5" />}
              defaultOpen={true}
            >
              <SpecificationSection.Grid>
                <SpecificationSection.Item label="Brand" value={car.brand?.name} />
                <SpecificationSection.Item label="Model" value={car.model?.name} />
                <SpecificationSection.Item label="Generation" value={car.generation?.name} />
                <SpecificationSection.Item label="Production Years" value={productionYears} />
                <SpecificationSection.Item label="Body Type" value={bodyType?.name} />
                <SpecificationSection.Item label="Doors" value={doorsNumber} />
                <SpecificationSection.Item label="Seats" value={seatsNumber} />
              </SpecificationSection.Grid>
            </SpecificationSection>

            {/* Engine */}
            {engine && (
              <SpecificationSection
                title="Engine"
                icon={<IoCogOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label="Engine Code" value={engine.engineCode} />
                  <SpecificationSection.Item label="Type" value={engine.engineType} />
                  <SpecificationSection.Item label="Displacement" value={engine.displacement} unit="cc" />
                  <SpecificationSection.Item label="Max Power" value={engine.maxPower} unit="HP" />
                  <SpecificationSection.Item label="Power @ RPM" value={engine.maxPowerRotationSpeed} unit="rpm" />
                  <SpecificationSection.Item label="Max Torque" value={engine.maxTorque} unit="Nm" />
                  <SpecificationSection.Item label="Torque @ RPM" value={engine.maxTorqueRotationSpeed} unit="rpm" />
                  <SpecificationSection.Item label="Cylinders" value={engine.cylindersNumber} />
                  <SpecificationSection.Item label="Cylinders Layout" value={engine.cylindersLayout} />
                  <SpecificationSection.Item label="Valves" value={engine.valvesNumber} />
                  <SpecificationSection.Item label="Turbo" value={engine.turbo} />
                  <SpecificationSection.Item label="Ignition" value={engine.ignition} />
                  <SpecificationSection.Item label="Injection" value={engine.injectionType} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Transmission */}
            {transmission && (
              <SpecificationSection
                title="Transmission"
                icon={<IoSettingsOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label="Type" value={transmission.transmissionType} />
                  <SpecificationSection.Item label="Name" value={transmission.transmissionName} />
                  <SpecificationSection.Item label="Gears" value={transmission.gearsNumber} />
                  <SpecificationSection.Item label="Clutch" value={transmission.clutchType} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Performance */}
            {performance && (
              <SpecificationSection
                title="Performance"
                icon={<IoSpeedometerOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label="Top Speed" value={performance.maxSpeed} unit="km/h" />
                  <SpecificationSection.Item label="0-100 km/h" value={performance.acceleration0100} unit="s" />
                  <SpecificationSection.Item label="100-200 km/h" value={performance.acceleration100200} unit="s" />
                  <SpecificationSection.Item label="Fuel Tank" value={performance.fuelTankCapacity} unit="L" />
                  <SpecificationSection.Item label="City Consumption" value={performance.fuelConsumptionCity} unit="L/100km" />
                  <SpecificationSection.Item label="Highway Consumption" value={performance.fuelConsumptionRoute} unit="L/100km" />
                  <SpecificationSection.Item label="Mixed Consumption" value={performance.fuelConsumptionMixed} unit="L/100km" />
                  <SpecificationSection.Item label="City Range" value={performance.rangeCity} unit="km" />
                  <SpecificationSection.Item label="Highway Range" value={performance.rangeRoute} unit="km" />
                  <SpecificationSection.Item label="Mixed Range" value={performance.rangeMixed} unit="km" />
                  <SpecificationSection.Item label="CO2 Emissions" value={performance.emissionCo2} unit="g/km" />
                  <SpecificationSection.Item label="Emission Standard" value={performance.fuelEmissionNorm} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Chassis */}
            {chassis && (
              <SpecificationSection
                title="Chassis & Brakes"
                icon={<IoLayersOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label="Drive" value={chassis.drive} />
                  <SpecificationSection.Item label="Suspension" value={chassis.suspension} />
                  <SpecificationSection.Item label="Front Brakes" value={chassis.frontBrakes} />
                  <SpecificationSection.Item label="Rear Brakes" value={chassis.backBrakes} />
                  <SpecificationSection.Item label="Front Brake Radius" value={chassis.frontBrakesRadius} unit="mm" />
                  <SpecificationSection.Item label="Rear Brake Radius" value={chassis.backBrakesRadius} unit="mm" />
                  <SpecificationSection.Item label="Basic Rims" value={chassis.basicRims} />
                  <SpecificationSection.Item label="Optional Rims" value={chassis.optionalRims} />
                  <SpecificationSection.Item label="Basic Tires" value={chassis.basicTires} />
                  <SpecificationSection.Item label="Optional Tires" value={chassis.optionalTires} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Outside Dimensions */}
            {outsideDimensions && (
              <SpecificationSection
                title="Outside Dimensions"
                icon={<IoResizeOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label="Length" value={outsideDimensions.length} unit="mm" />
                  <SpecificationSection.Item label="Width" value={outsideDimensions.width} unit="mm" />
                  <SpecificationSection.Item label="Width with Mirrors" value={outsideDimensions.widthWithMirrors} unit="mm" />
                  <SpecificationSection.Item label="Height" value={outsideDimensions.height} unit="mm" />
                  <SpecificationSection.Item label="Height with Trunk Open" value={outsideDimensions.heightWithOpenTrunk} unit="mm" />
                  <SpecificationSection.Item label="Wheelbase" value={outsideDimensions.wheelBase} unit="mm" />
                  <SpecificationSection.Item label="Front Track" value={outsideDimensions.wheelBaseFront} unit="mm" />
                  <SpecificationSection.Item label="Rear Track" value={outsideDimensions.wheelBaseBack} unit="mm" />
                  <SpecificationSection.Item label="Front Overhang" value={outsideDimensions.overhangFront} unit="mm" />
                  <SpecificationSection.Item label="Rear Overhang" value={outsideDimensions.overhangBack} unit="mm" />
                  <SpecificationSection.Item label="Ground Clearance" value={outsideDimensions.clearance} unit="mm" />
                  <SpecificationSection.Item label="Max Roof Load" value={outsideDimensions.maxRoofLoad} unit="kg" />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Inside Dimensions */}
            {insideDimensions && (
              <SpecificationSection
                title="Inside Dimensions"
                icon={<IoGridOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label="Front Headroom" value={insideDimensions.heightFromSeatToRoofFront} unit="mm" />
                  <SpecificationSection.Item label="Rear Headroom" value={insideDimensions.heightFromSeatToRoofBack} unit="mm" />
                  <SpecificationSection.Item label="Min Trunk Space" value={insideDimensions.minTrunkSpace} unit="L" />
                  <SpecificationSection.Item label="Max Trunk Space" value={insideDimensions.maxTrunkSpace} unit="L" />
                  <SpecificationSection.Item label="Min Trunk Length" value={insideDimensions.minTrunkLength} unit="mm" />
                  <SpecificationSection.Item label="Max Trunk Length" value={insideDimensions.maxTrunkLength} unit="mm" />
                  <SpecificationSection.Item label="Trunk Width" value={insideDimensions.trunkWidth} unit="mm" />
                  <SpecificationSection.Item label="Trunk Height" value={insideDimensions.trunkHeight} unit="mm" />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}
          </div>
        </section>

        {/* Reviews and Fuel Reports sections */}
        <section>
          <Tabs defaultValue="reviews">
            <Tabs.List>
              <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
              <Tabs.Trigger value="fuelReports">Fuel Reports</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="reviews">
              <ReviewsSection carId={parseInt(id)} />
            </Tabs.Content>

            <Tabs.Content value="fuelReports">
              <FuelReportsSection carId={parseInt(id)} />
            </Tabs.Content>
          </Tabs>
        </section>
      </div>

      {/* Data proposal modal */}
      <DataProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        carId={parseInt(id)}
        carName={carName}
      />
    </div>
  );
};


/**
 * Small component for displaying quick specs
 */
const QuickSpec = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
      {icon}
      <span className="text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
    </div>
    <p className="text-lg font-semibold text-neutral-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default CarDetailsPage;
