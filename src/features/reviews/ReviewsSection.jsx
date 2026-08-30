import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoAddOutline, IoStarOutline, IoChevronDownOutline } from 'react-icons/io5';
import { getReviews, getAverageRatings } from '../../api/reviews';
import { useAuth } from '../../hooks';
import { Button, Spinner, Pagination, Modal, Alert } from '../../components/ui';
import ReviewCard from './ReviewCard';
import AddReviewForm from './AddReviewForm';
import RatingsChart from './RatingsChart';


// Reusable component for displaying reviews section with average ratings chart, reviews list, and add review functionality
const ReviewsSection = ({ carId, defaultOpen = true, className = '' }) => {
  const { t } = useTranslation('reviews');
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [page, setPage] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const pageSize = 5;

  // Fetch reviews with pagination
  const { 
    data: reviewsData, 
    isLoading: isLoadingReviews,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ['reviews', carId, page, pageSize],
    queryFn: () => getReviews(carId, { page, size: pageSize }),
    enabled: !!carId,
  });

  // Fetch average ratings
  const { 
    data: averageRatings,
    isLoading: isLoadingRatings,
  } = useQuery({
    queryKey: ['averageRatings', carId],
    queryFn: () => getAverageRatings(carId),
    enabled: !!carId,
  });

  const reviews = reviewsData?.content || [];
  const totalElements = reviewsData?.totalElements || 0;
  const totalPages = reviewsData?.totalPages || 0;

  const handleReviewSuccess = () => {
    setShowAddForm(false);
    setPage(0);
  };

  return (
    <div className={`border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden ${className}`}>
      
      {/* Section header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <IoStarOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {t('title')}
          </h2>
          {totalElements > 0 && (
            <span className="text-sm text-neutral-500">
              ({t('submitted', { count: totalElements })})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddForm(true);
              }}
              leftIcon={<IoAddOutline className="w-4 h-4" />}
            >
              {t('writeReview')}
            </Button>
          )}
          <IoChevronDownOutline 
            className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Collapsible content */}
      {isOpen && (
      <div className="p-4 bg-white dark:bg-neutral-800">

      {/* Average ratings chart */}
      {isLoadingRatings ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <RatingsChart averageRatings={averageRatings} />
        </div>
      )}

      {/* Reviews list */}
      {isLoadingReviews ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isReviewsError ? (
        <Alert variant="error" title={t('common:errors.somethingWentWrong')}>
          {t('common:errors.tryAgain')}
        </Alert>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
          <IoStarOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            {t('empty.noReviews')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t('empty.noReviewsDescription')}
          </p>
          {isAuthenticated ? (
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              leftIcon={<IoAddOutline className="w-4 h-4" />}
            >
              {t('writeReview')}
            </Button>
          ) : (
            <p className="text-sm text-neutral-500">
              <Button to="/login" variant="ghost" size="sm">
                {t('auth:login')}
              </Button>
              {t('messages.loginRequired')}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              carId={carId}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
      </div>
      )}

      {/* Add review modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title={t('writeReview')}
        size="lg"
      >
        <AddReviewForm
          carId={carId}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>
    </div>
  );
};

export default ReviewsSection;
