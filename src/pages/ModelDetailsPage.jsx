import { useEffect } from 'react';
import { useParams, Link, useNavigationType } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCarSportOutline,
  IoLayersOutline,
} from 'react-icons/io5';
import { getModelById } from '../api/models';
import { Button, Spinner, Badge } from '../components/ui';


const ModelDetailsPage = () => {
  const { id } = useParams();
  const navigationType = useNavigationType();

  // Scroll to top only on new navigation (not on back/forward)
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [id, navigationType]);

  const { data: model, isLoading, isError, error } = useQuery({
    queryKey: ['model', id],
    queryFn: () => getModelById(id),
    enabled: !!id,
  });

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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Model not found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.response?.status === 404
              ? "The model you're looking for doesn't exist or has been removed."
              : "Something went wrong while loading model details."
            }
          </p>
          <Button to="/" variant="primary">Go Home</Button>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    brand,
    generations = [],
  } = model;

  const totalCars = generations.reduce((acc, g) => acc + (g.carsCount || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">

      {/* Breadcrumb navigation */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link
              to="/"
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
            >
              <IoChevronBackOutline className="w-4 h-4" />
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              to="/brands"
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              All Brands
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              to={`/brands/${brand?.id}`}
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {brand?.name}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 dark:text-white font-medium truncate">
              {name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Model header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Model icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <IoCarSportOutline className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
            </div>

            {/* Model info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {brand?.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    className="w-8 h-8 object-contain"
                  />
                ) : null}
                <span className="text-neutral-500 dark:text-neutral-400 text-lg">
                  {brand?.name}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="primary" size="md">
                  <IoLayersOutline className="w-3.5 h-3.5 mr-1" />
                  {generations.length} {generations.length === 1 ? 'generation' : 'generations'}
                </Badge>
                <Badge variant="default" size="md">
                  <IoCarSportOutline className="w-3.5 h-3.5 mr-1" />
                  {totalCars} {totalCars === 1 ? 'car' : 'cars'}
                </Badge>
              </div>

              {description && (
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              <Button
                to={`/cars?brandIds=${brand?.id}&modelIds=${id}`}
                variant="primary"
                leftIcon={<IoCarSportOutline className="w-4 h-4" />}
              >
                View all cars
              </Button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <QuickStat
            icon={<IoLayersOutline className="w-5 h-5" />}
            label="Generations"
            value={generations.length}
          />
          <QuickStat
            icon={<IoCarSportOutline className="w-5 h-5" />}
            label="Total Cars"
            value={totalCars}
          />
          <QuickStat
            icon={<IoCarSportOutline className="w-5 h-5" />}
            label="Brand"
            value={brand?.name || 'N/A'}
          />
        </div>

        {/* Generations section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Generations
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Click on a generation to view its cars
              </p>
            </div>
          </div>

          {generations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {generations.map((generation) => (
                <GenerationCard
                  key={generation.id}
                  generation={generation}
                  brandId={brand?.id}
                  modelId={id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <IoLayersOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400">
                No generations available for this model yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const GenerationCard = ({ generation }) => {
  const { id, name, carsCount = 0 } = generation;

  return (
    <Link
      to={`/generations/${id}`}
      className="relative p-4 rounded-xl border-2 transition-all duration-200 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md group"
    >
      {/* Generation icon */}
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
        <IoLayersOutline className="w-6 h-6" />
      </div>

      {/* Generation name */}
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 pr-6">
        {name}
      </h3>

      {/* Cars count */}
      <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
        <IoCarSportOutline className="w-4 h-4" />
        <span>{carsCount} {carsCount === 1 ? 'car' : 'cars'}</span>
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-4 right-4">
        <IoChevronForwardOutline className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
      </div>
    </Link>
  );
};


const QuickStat = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-center">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
      {value}
    </div>
    <div className="text-sm text-neutral-500 dark:text-neutral-400">
      {label}
    </div>
  </div>
);


export default ModelDetailsPage;
