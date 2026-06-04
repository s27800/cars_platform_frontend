import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  IoArrowBackOutline, 
  IoCarSportOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getUserReviews } from '../api/users';
import { Card, Spinner, Button, Badge, Rating, Pagination } from '../components/ui';
import { RATING_CATEGORIES } from '../utils/constants';
import { formatDate, calculateAverage } from '../utils/helpers';


const UserReviewsPage = () => {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const { 
    data: reviewsData, 
    isLoading, 
    error,
  } = useQuery({
    queryKey: ['userReviews', page, pageSize],
    queryFn: () => getUserReviews({ page, size: pageSize, sort: 'reviewDate,desc' }),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  // Redirect not authenticated user
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/profile/reviews' } }} replace />;
  }

  const reviews = reviewsData?.content || [];
  const totalPages = reviewsData?.totalPages || 0;
  const totalElements = reviewsData?.totalElements || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            to="/profile" 
            variant="ghost" 
            size="sm"
            leftIcon={<IoArrowBackOutline className="w-4 h-4" />}
          >
            Back to Profile
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <IoDocumentTextOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              My Reviews
            </h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {totalElements} {totalElements === 1 ? 'review' : 'reviews'} submitted
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card variant="bordered" padding="lg" className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">
            Failed to load your reviews. Please try again.
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && reviews.length === 0 && (
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="py-8">
            <IoDocumentTextOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You haven't submitted any car reviews yet.
            </p>
            <Button to="/cars" variant="primary">
              Browse Cars
            </Button>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      {!isLoading && !error && reviews.length > 0 && (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <UserReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};


// Card component for displaying user's review with car info
const UserReviewCard = ({ review }) => {
  const ratings = RATING_CATEGORIES.map(cat => review[cat.key]);
  const averageRating = calculateAverage(ratings);
  const carInfo = review.carInfo;

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden">

      {/* Car Info Header */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
        <Link 
          to={`/cars/${carInfo?.carId}`}
          className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg">
            <IoCarSportOutline className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {carInfo?.brandName} {carInfo?.modelName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {carInfo?.generationName}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">

          {/* Approval status badge */}
          <Badge 
            variant={review.isApproved ? 'success' : 'warning'} 
            size="sm"
          >
            {review.isApproved ? 'Approved' : 'Pending'}
          </Badge>
        </div>
      </div>

      {/* Review Content */}
      <div className="p-4">
        
        {/* Rating and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Rating value={averageRating} readonly size="sm" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(review.reviewDate)}
          </p>
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
            {review.comment}
          </p>
        )}

        {/* Detailed ratings grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
          {RATING_CATEGORIES.map(({ key, label }) => {
            const value = review[key];
            if (value === null || value === undefined) return null;
            
            return (
              <div key={key} className="text-center">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  {label}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <Rating value={value} readonly size="sm" max={5} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Likes count */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {review.likesCount || 0} {review.likesCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
      </div>
    </Card>
  );
};


export default UserReviewsPage;
