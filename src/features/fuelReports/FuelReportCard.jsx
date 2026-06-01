import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoHeartOutline, IoHeart, IoSpeedometerOutline } from 'react-icons/io5';
import { toggleFuelReportLike, getFuelReportLikeStatus } from '../../api/likes';
import { useAuth } from '../../hooks';
import { Avatar, Badge } from '../../components/ui';
import { formatDate, getConsumptionLevel } from '../../utils/helpers';


// Reusable card component displaying fuel consumption report with like functionality
const FuelReportCard = ({ report, carId }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likesCount || 0);

  // Fetch like status for authenticated users
  const { data: likeStatus } = useQuery({
    queryKey: ['fuelReportLikeStatus', report.id],
    queryFn: () => getFuelReportLikeStatus(report.id),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  // Update local state when like status is fetched
  useEffect(() => {
    if (likeStatus) {
      setIsLiked(likeStatus.liked);
      setLikeCount(likeStatus.likesCount);
    }
  }, [likeStatus]);

  const likeMutation = useMutation({
    mutationFn: () => toggleFuelReportLike(report.id),
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
      queryClient.invalidateQueries({ queryKey: ['fuelReportLikeStatus', report.id] });
    },
  });

  const authorName = report.usernameResponse?.username || 'Anonymous';
  const fuelValue = parseFloat(report.fuelConsumption || 0).toFixed(1);
  const level = getConsumptionLevel(fuelValue);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">

      {/* Author + consumption header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={authorName} size="md" />
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">{authorName}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {formatDate(report.reportDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {report.isApproved === false && (
            <Badge variant="warning" size="sm">Pending</Badge>
          )}
          
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <IoSpeedometerOutline className={`w-5 h-5 ${level.color}`} />
              <span className={`text-2xl font-bold ${level.color}`}>{fuelValue}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">L/100km</span>
            </div>
            <span className={`text-xs ${level.color}`}>{level.label}</span>
          </div>
        </div>
      </div>

      {report.comment && (
        <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
          {report.comment}
        </p>
      )}

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
          title={isAuthenticated ? 'Like this report' : 'Login to like reports'}
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

export default FuelReportCard;
