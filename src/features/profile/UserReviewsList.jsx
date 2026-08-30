import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoCarSportOutline, IoDocumentTextOutline, IoTrashOutline } from 'react-icons/io5';
import { getUserReviews } from '../../api/users';
import { deleteReview } from '../../api/reviews';
import { Card, Spinner, Button, Badge, Rating, Pagination, ConfirmModal, IconButton } from '../../components/ui';
import { RATING_CATEGORIES } from '../../utils/constants';
import { formatDate, calculateAverage } from '../../utils/helpers';


const UserReviewsList = () => {
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const pageSize = 5;
  const queryClient = useQueryClient();

  const { 
    data: reviewsData, 
    isLoading, 
    error,
  } = useQuery({
    queryKey: ['userReviews', page, pageSize],
    queryFn: () => getUserReviews({ page, size: pageSize, sort: 'reviewDate,desc' }),
    staleTime: 30000,
  });

  const reviews = reviewsData?.content || [];
  const totalPages = reviewsData?.totalPages || 0;
  const totalElements = reviewsData?.totalElements || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
      setDeleteTarget(null);
    },
  });

  const handleDeleteClick = (review) => {
    setDeleteTarget(review);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400 mb-4">
          Failed to load your reviews. Please try again.
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Empty State
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
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
    );
  }

  return (
    <div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {totalElements} {totalElements === 1 ? 'review' : 'reviews'} submitted
      </p>

      <div className="space-y-4">
        {reviews.map((review) => (
          <UserReviewCard 
            key={review.id} 
            review={review} 
            onDelete={() => handleDeleteClick(review)}
          />
        ))}
      </div>

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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message={`Are you sure you want to delete your review for ${deleteTarget?.carInfo?.brandName} ${deleteTarget?.carInfo?.modelName}?`}
        confirmText="Delete Review"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};


// Card component for displaying user's review with car info
const UserReviewCard = ({ review, onDelete }) => {
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

        <Badge 
          variant={review.isApproved ? 'success' : 'warning'} 
          size="sm"
        >
          {review.isApproved ? 'Approved' : 'Pending'}
        </Badge>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
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

        {/* Footer with likes and delete */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {review.likesCount || 0} {review.likesCount === 1 ? 'like' : 'likes'}
          </span>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onDelete}
            label="Delete review"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <IoTrashOutline className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};


export default UserReviewsList;
