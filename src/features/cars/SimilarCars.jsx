import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getSimilarCars } from '../../api/cars';
import { CarCard } from '../../components/shared';
import { Spinner } from '../../components/ui';


const SimilarCars = ({ carId }) => {
  const { t } = useTranslation('cars');
  
  const { data: similarCars, isLoading, isError } = useQuery({
    queryKey: ['similarCars', carId],
    queryFn: () => getSimilarCars(carId, 4),
    enabled: !!carId,
    staleTime: 5 * 60 * 1000, // 5 min cache
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
