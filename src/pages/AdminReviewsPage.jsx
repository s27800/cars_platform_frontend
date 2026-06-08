import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  IoArrowBackOutline,
  IoCarSportOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoChevronDownOutline,
  IoHeartOutline,
  IoStarOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getPendingReviews, approveReview } from '../api/admin';
import { Card, Spinner, Button, Badge, Pagination, Rating } from '../components/ui';
import { RATING_CATEGORIES } from '../utils/constants';
import { formatDate, calculateAverage } from '../utils/helpers';


// Review card component for admin view
const ReviewCard = ({ review, onApprove, onReject, isResolving }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const carInfo = review.carInfo;
  
  // Calculate average rating
  const ratings = RATING_CATEGORIES.map(cat => review[cat.key]).filter(r => r != null);
  const averageRating = calculateAverage(ratings);

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-600">

      {/* Header with car info */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-neutral-800/80 dark:to-neutral-800/40 border-b border-neutral-200 dark:border-neutral-700">
        <Link
          to={`/cars/${carInfo?.carId}`}
          className="flex items-center gap-4 group"
        >
          <div className="p-2.5 bg-white dark:bg-neutral-700 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
            <IoCarSportOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-lg text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {carInfo?.brandName} {carInfo?.modelName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {carInfo?.generationName}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">

          {/* Average rating */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-700 rounded-lg shadow-sm">
            <IoStarOutline className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-neutral-900 dark:text-white">{averageRating.toFixed(1)}</span>
          </div>
          
          <Badge variant="warning" size="md" className="shadow-sm">
            <IoTimeOutline className="w-4 h-4 mr-1.5" />
            Pending
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoPersonOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span className="font-medium">{review.usernameResponse?.username || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoCalendarOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span>{formatDate(review.reviewDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoHeartOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span>{review.likesCount || 0} likes</span>
          </div>
        </div>

        {/* User comment */}
        {review.comment && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Review comment:
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-100 dark:border-neutral-600/50 leading-relaxed">
              {review.comment}
            </p>
          </div>
        )}

        {/* Detailed ratings */}
        <div className="mb-5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors ${isExpanded ? 'rotate-180' : ''}`}>
              <IoChevronDownOutline className="w-3.5 h-3.5 transition-transform" />
            </span>
            View detailed ratings ({RATING_CATEGORIES.length} categories)
          </button>
          
          {isExpanded && (
            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {RATING_CATEGORIES.map(({ key, label }) => {
                  const value = review[key];
                  return (
                    <div key={key} className="flex items-center justify-between gap-2 p-2.5 bg-white/70 dark:bg-amber-900/40 rounded-lg border border-amber-100 dark:border-amber-800/50">
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400 truncate">
                        {label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Rating value={value || 0} readonly size="xs" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 min-w-[20px] text-right">
                          {value || '-'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApprove(review.id)}
            disabled={isResolving}
            loading={isResolving}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 border border-transparent hover:border-green-200 dark:hover:border-green-800 disabled:text-green-400 disabled:opacity-60"
          >
            <IoCheckmarkCircleOutline className="w-4 h-4" />
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onReject(review.id)}
            disabled={isResolving}
            className="flex items-center gap-2"
          >
            <IoCloseCircleOutline className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};


const AdminReviewsPage = () => {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Fetch pending reviews
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminPendingReviews', page, pageSize],
    queryFn: () => getPendingReviews({ page, size: pageSize, sort: 'reviewDate,desc' }),
    enabled: isAuthenticated && isAdmin,
    staleTime: 30 * 1000,
  });

  // Resolve review mutation
  const resolveMutation = useMutation({
    mutationFn: ({ id, approve }) => approveReview(id, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingReviews'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: (error) => {
      console.error('Failed to resolve review:', error);
      alert(error?.response?.data?.message || 'Failed to resolve review. Please try again.');
    },
  });

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated)
    return <Navigate to="/login" replace />;

  // Redirect if not admin
  if (!isAdmin)
    return <Navigate to="/" replace />;

  const reviews = reviewsData?.content || [];
  const totalPages = reviewsData?.totalPages || 0;
  const totalElements = reviewsData?.totalElements || 0;

  const handleApprove = (reviewId) => {
    resolveMutation.mutate({ id: reviewId, approve: true });
  };

  const handleReject = (reviewId) => {
    resolveMutation.mutate({ id: reviewId, approve: false });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
        
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 group"
        >
          <IoArrowBackOutline className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/25 dark:shadow-amber-500/10">
            <IoDocumentTextOutline className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Review Moderation
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Review and moderate user-submitted car reviews
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Loading reviews...</p>
        </div>
      ) : error ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <IoCloseCircleOutline className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
            Failed to load reviews. Please try again.
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      ) : reviews.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <IoCheckmarkCircleOutline className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            All caught up!
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            There are no pending reviews to moderate. Check back later.
          </p>
        </Card>
      ) : (
        <>
        
          {/* Stats */}
          <div className="mb-6 px-4 py-3 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">{totalElements}</span>
              {' '}review{totalElements !== 1 ? 's' : ''} pending moderation
            </p>
          </div>

          {/* Reviews list */}
          <div className="space-y-5">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onApprove={handleApprove}
                onReject={handleReject}
                isResolving={resolveMutation.isPending}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminReviewsPage;
