import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('cars');
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{t('details.carNotFound')}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.response?.status === 404 
              ? t('details.carNotFoundDescription')
              : t('details.loadError')
            }
          </p>
          <Button to="/cars" variant="primary">{t('details.browseCars')}</Button>
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
                    {t(`bodyTypes.${bodyType.name}`, bodyType.name)}
                  </Badge>
                )}
                {engine?.engineType && (
                  <Badge variant="default" size="md">
                    {t(`engineTypes.${engine.engineType}`, engine.engineType)}
                  </Badge>
                )}
                {chassis?.drive && (
                  <Badge variant="default" size="md">
                    {t(`driveTypes.${chassis.drive}`, chassis.drive)}
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
                  label={t('specs.maxPower')}
                  value={`${engine.maxPower} HP`}
                />
              )}
              {performance?.maxSpeed && (
                <QuickSpec 
                  icon={<IoSpeedometerOutline />}
                  label={t('specs.topSpeed')}
                  value={`${performance.maxSpeed} km/h`}
                />
              )}
              {performance?.acceleration0100 && (
                <QuickSpec 
                  icon={<IoSpeedometerOutline />}
                  label={t('specs.acceleration')}
                  value={`${performance.acceleration0100}s`}
                />
              )}
              {engine?.displacement && (
                <QuickSpec 
                  icon={<IoCogOutline />}
                  label={t('specs.displacement')}
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
                {isInComparison ? t('details.removeCompare') : t('details.compare')}
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => setShowProposalModal(true)}
                  leftIcon={<IoCreateOutline className="w-5 h-5" />}
                >
                  {t('details.suggestCorrection')}
                </Button>
              )}
            </div>

            {/* Comparison list indicator */}
            {comparisonCars.length > 0 && (
              <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {t('details.carsInComparison', { count: comparisonCars.length })}{' '}
                  <Link to="/comparison" className="underline hover:no-underline">
                    {t('details.viewComparison')} →
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
            {t('details.technicalSpecifications')}
          </h2>

          <div className="space-y-3">

            {/* Basic Info */}
            <SpecificationSection
              title={t('specs.groups.basic')}
              icon={<IoCarSportOutline className="w-5 h-5" />}
              defaultOpen={true}
            >
              <SpecificationSection.Grid>
                <SpecificationSection.Item label={t('specs.brand')} value={car.brand?.name} />
                <SpecificationSection.Item label={t('specs.model')} value={car.model?.name} />
                <SpecificationSection.Item label={t('specs.generation')} value={car.generation?.name} />
                <SpecificationSection.Item label={t('specs.productionYears')} value={productionYears} />
                <SpecificationSection.Item label={t('specs.bodyType')} value={bodyType?.name ? t(`bodyTypes.${bodyType.name}`, bodyType.name) : null} />
                <SpecificationSection.Item label={t('specs.doors')} value={doorsNumber} />
                <SpecificationSection.Item label={t('specs.seats')} value={seatsNumber} />
              </SpecificationSection.Grid>
            </SpecificationSection>

            {/* Engine */}
            {engine && (
              <SpecificationSection
                title={t('specs.groups.engine')}
                icon={<IoCogOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label={t('specs.engineCode')} value={engine.engineCode} />
                  <SpecificationSection.Item label={t('specs.fuelType')} value={engine.engineType ? t(`engineTypes.${engine.engineType}`, engine.engineType) : null} />
                  <SpecificationSection.Item label={t('specs.displacement')} value={engine.displacement} unit="cc" />
                  <SpecificationSection.Item label={t('specs.maxPower')} value={engine.maxPower} unit="HP" />
                  <SpecificationSection.Item label={t('specs.maxPowerRpm')} value={engine.maxPowerRotationSpeed} unit="rpm" />
                  <SpecificationSection.Item label={t('specs.maxTorque')} value={engine.maxTorque} unit="Nm" />
                  <SpecificationSection.Item label={t('specs.maxTorqueRpm')} value={engine.maxTorqueRotationSpeed} unit="rpm" />
                  <SpecificationSection.Item label={t('specs.cylinders')} value={engine.cylindersNumber} />
                  <SpecificationSection.Item label={t('specs.cylindersLayout')} value={engine.cylindersLayout} />
                  <SpecificationSection.Item label={t('specs.valves')} value={engine.valvesNumber} />
                  <SpecificationSection.Item label={t('specs.turbo')} value={engine.turbo != null ? (engine.turbo ? t('common.yes') : t('common.no')) : null} />
                  <SpecificationSection.Item label={t('specs.ignition')} value={engine.ignition} />
                  <SpecificationSection.Item label={t('specs.injection')} value={engine.injectionType} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Transmission */}
            {transmission && (
              <SpecificationSection
                title={t('specs.groups.transmission')}
                icon={<IoSettingsOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label={t('specs.transmissionType')} value={transmission.transmissionType ? t(`transmissionTypes.${transmission.transmissionType}`, transmission.transmissionType) : null} />
                  <SpecificationSection.Item label={t('specs.transmissionName')} value={transmission.transmissionName} />
                  <SpecificationSection.Item label={t('specs.gears')} value={transmission.gearsNumber} />
                  <SpecificationSection.Item label={t('specs.clutch')} value={transmission.clutchType} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Performance */}
            {performance && (
              <SpecificationSection
                title={t('specs.groups.performance')}
                icon={<IoSpeedometerOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label={t('specs.topSpeed')} value={performance.maxSpeed} unit="km/h" />
                  <SpecificationSection.Item label={t('specs.acceleration')} value={performance.acceleration0100} unit="s" />
                  <SpecificationSection.Item label={t('specs.acceleration100200')} value={performance.acceleration100200} unit="s" />
                  <SpecificationSection.Item label={t('specs.fuelTank')} value={performance.fuelTankCapacity} unit="L" />
                  <SpecificationSection.Item label={t('specs.consumptionCity')} value={performance.fuelConsumptionCity} unit="L/100km" />
                  <SpecificationSection.Item label={t('specs.consumptionHighway')} value={performance.fuelConsumptionRoute} unit="L/100km" />
                  <SpecificationSection.Item label={t('specs.consumptionMixed')} value={performance.fuelConsumptionMixed} unit="L/100km" />
                  <SpecificationSection.Item label={t('specs.rangeCity')} value={performance.rangeCity} unit="km" />
                  <SpecificationSection.Item label={t('specs.rangeHighway')} value={performance.rangeRoute} unit="km" />
                  <SpecificationSection.Item label={t('specs.rangeMixed')} value={performance.rangeMixed} unit="km" />
                  <SpecificationSection.Item label={t('specs.co2Emissions')} value={performance.emissionCo2} unit="g/km" />
                  <SpecificationSection.Item label={t('specs.emissionStandard')} value={performance.fuelEmissionNorm} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Chassis */}
            {chassis && (
              <SpecificationSection
                title={t('specs.groups.chassis')}
                icon={<IoLayersOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label={t('specs.drive')} value={chassis.drive ? t(`driveTypes.${chassis.drive}`, chassis.drive) : null} />
                  <SpecificationSection.Item label={t('specs.suspension')} value={chassis.suspension} />
                  <SpecificationSection.Item label={t('specs.frontBrakes')} value={chassis.frontBrakes} />
                  <SpecificationSection.Item label={t('specs.rearBrakes')} value={chassis.backBrakes} />
                  <SpecificationSection.Item label={t('specs.frontBrakesRadius')} value={chassis.frontBrakesRadius} unit="mm" />
                  <SpecificationSection.Item label={t('specs.rearBrakesRadius')} value={chassis.backBrakesRadius} unit="mm" />
                  <SpecificationSection.Item label={t('specs.basicRims')} value={chassis.basicRims} />
                  <SpecificationSection.Item label={t('specs.optionalRims')} value={chassis.optionalRims} />
                  <SpecificationSection.Item label={t('specs.basicTires')} value={chassis.basicTires} />
                  <SpecificationSection.Item label={t('specs.optionalTires')} value={chassis.optionalTires} />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Outside Dimensions */}
            {outsideDimensions && (
              <SpecificationSection
                title={t('specs.groups.outsideDimensions')}
                icon={<IoResizeOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label={t('specs.length')} value={outsideDimensions.length} unit="mm" />
                  <SpecificationSection.Item label={t('specs.width')} value={outsideDimensions.width} unit="mm" />
                  <SpecificationSection.Item label={t('specs.widthWithMirrors')} value={outsideDimensions.widthWithMirrors} unit="mm" />
                  <SpecificationSection.Item label={t('specs.height')} value={outsideDimensions.height} unit="mm" />
                  <SpecificationSection.Item label={t('specs.heightWithTrunk')} value={outsideDimensions.heightWithOpenTrunk} unit="mm" />
                  <SpecificationSection.Item label={t('specs.wheelbase')} value={outsideDimensions.wheelBase} unit="mm" />
                  <SpecificationSection.Item label={t('specs.frontTrack')} value={outsideDimensions.wheelBaseFront} unit="mm" />
                  <SpecificationSection.Item label={t('specs.rearTrack')} value={outsideDimensions.wheelBaseBack} unit="mm" />
                  <SpecificationSection.Item label={t('specs.frontOverhang')} value={outsideDimensions.overhangFront} unit="mm" />
                  <SpecificationSection.Item label={t('specs.rearOverhang')} value={outsideDimensions.overhangBack} unit="mm" />
                  <SpecificationSection.Item label={t('specs.clearance')} value={outsideDimensions.clearance} unit="mm" />
                  <SpecificationSection.Item label={t('specs.maxRoofLoad')} value={outsideDimensions.maxRoofLoad} unit="kg" />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}

            {/* Inside Dimensions */}
            {insideDimensions && (
              <SpecificationSection
                title={t('specs.groups.insideDimensions')}
                icon={<IoGridOutline className="w-5 h-5" />}
                defaultOpen={true}
              >
                <SpecificationSection.Grid>
                  <SpecificationSection.Item label={t('specs.frontHeadroom')} value={insideDimensions.heightFromSeatToRoofFront} unit="mm" />
                  <SpecificationSection.Item label={t('specs.rearHeadroom')} value={insideDimensions.heightFromSeatToRoofBack} unit="mm" />
                  <SpecificationSection.Item label={t('specs.trunkMin')} value={insideDimensions.minTrunkSpace} unit="L" />
                  <SpecificationSection.Item label={t('specs.trunkMax')} value={insideDimensions.maxTrunkSpace} unit="L" />
                  <SpecificationSection.Item label={t('specs.trunkLengthMin')} value={insideDimensions.minTrunkLength} unit="mm" />
                  <SpecificationSection.Item label={t('specs.trunkLengthMax')} value={insideDimensions.maxTrunkLength} unit="mm" />
                  <SpecificationSection.Item label={t('specs.trunkWidth')} value={insideDimensions.trunkWidth} unit="mm" />
                  <SpecificationSection.Item label={t('specs.trunkHeight')} value={insideDimensions.trunkHeight} unit="mm" />
                </SpecificationSection.Grid>
              </SpecificationSection>
            )}
          </div>
        </section>

        {/* Reviews and Fuel Reports sections */}
        <section>
          <Tabs defaultValue="reviews">
            <Tabs.List>
              <Tabs.Trigger value="reviews">{t('details.reviews')}</Tabs.Trigger>
              <Tabs.Trigger value="fuelReports">{t('details.fuelReports')}</Tabs.Trigger>
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
