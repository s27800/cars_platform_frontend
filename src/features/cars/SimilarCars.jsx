import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getSimilarCars } from './api';
import CarCard from './CarCard';
import { Spinner } from '../../shared/components/ui';
import { STALE_TIME } from '../../shared/utils/constants';


// Cars the backend considers close to the one being viewed
const SimilarCars = ({ carId }) => {
  const { t } = useTranslation('cars');

  const { data: similarCars, isLoading, isError } = useQuery({
    queryKey: ['cars', 'similar', carId],
    queryFn: () => getSimilarCars(carId, 4),
    enabled: !!carId,
    staleTime: STALE_TIME.LONG,
    retry: 1,
  });

  if (isError)
    return null;

  if (isLoading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
          {t('details.similarCars')}
        </h2>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </section>
    );
  }

  if (!similarCars?.length)
    return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
        {t('details.similarCars')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
};

export default SimilarCars;
