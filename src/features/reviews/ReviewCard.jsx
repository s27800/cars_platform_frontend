import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { toggleReviewLike, getReviewLikeStatus } from '../../api/likes';
import { useAuth } from '../../hooks';
import { Avatar, Badge, Rating } from '../../components/ui';
import { RATING_CATEGORIES } from '../../utils/constants';
import { formatDate, calculateAverage } from '../../utils/helpers';


// Reusable component displaying a single review with ratings breakdown and like button
const ReviewCard = ({ review }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likesCount || 0);

  // Fetch like status for authenticated users
  const { data: likeStatus } = useQuery({
    queryKey: ['reviewLikeStatus', review.id],
    queryFn: () => getReviewLikeStatus(review.id),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const [lastLikeStatus, setLastLikeStatus] = useState(null);

  if (likeStatus && lastLikeStatus !== likeStatus) {
    setLastLikeStatus(likeStatus);
    setIsLiked(likeStatus.liked);
    setLikeCount(likeStatus.likesCount);
  }

  const likeMutation = useMutation({
    mutationFn: () => toggleReviewLike(review.id),
    onMutate: () => {
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    },
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setLikeCount(data.likesCount);
    },
    onError: () => {
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewLikeStatus', review.id] });
    },
  });

  const ratings = RATING_CATEGORIES.map(cat => review[cat.key]);
  const averageRating = calculateAverage(ratings);
  const authorName = review.usernameResponse?.username || 'Anonymous';

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">

      {/* Author info and date */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar 
            name={authorName} 
            size="md"
          />
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {authorName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {formatDate(review.reviewDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {/* Approval status badge */}
          {review.isApproved === false && (
            <Badge variant="warning" size="sm">
              Pending
            </Badge>
          )}
          
          {/* Overall rating */}
          <div className="flex items-center gap-2">
            <Rating value={averageRating} readonly size="sm" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Detailed ratings grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
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

      {/* Like button */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
        <button
          onClick={() => isAuthenticated && likeMutation.mutate()}
          disabled={!isAuthenticated || likeMutation.isPending}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors
            ${isAuthenticated 
              ? 'hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
            }
            ${isLiked ? 'text-red-500' : 'text-neutral-600 dark:text-neutral-400'}
          `}
          title={isAuthenticated ? 'Like this review' : 'Login to like reviews'}
        >
          {isLiked ? <IoHeart className="w-5 h-5" /> : <IoHeartOutline className="w-5 h-5" />}
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        {!isAuthenticated && (
          <span className="text-xs text-neutral-400">Login to interact</span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
