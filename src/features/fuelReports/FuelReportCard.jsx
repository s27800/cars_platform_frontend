import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoHeartOutline, IoHeart, IoSpeedometerOutline } from 'react-icons/io5';
import { toggleFuelReportLike, getFuelReportLikeStatus } from '../../shared/api/likes';
import { useAuth } from '../../shared/hooks';
import { Avatar, Badge } from '../../shared/components/ui';
import { formatDate, getConsumptionLevel } from '../../shared/utils/helpers';
import { STALE_TIME } from '../../shared/utils/constants';


// Reusable card component displaying fuel consumption report with like functionality
const FuelReportCard = ({ report }) => {
  const { t } = useTranslation('cars');
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likesCount || 0);

  // Fetch like status for authenticated users
  const { data: likeStatus } = useQuery({
    queryKey: ['fuelReports', 'likeStatus', report.id],
    queryFn: () => getFuelReportLikeStatus(report.id),
    enabled: isAuthenticated,
    staleTime: STALE_TIME.SHORT,
  });

  const [lastLikeStatus, setLastLikeStatus] = useState(null);

  if (likeStatus && lastLikeStatus !== likeStatus) {
    setLastLikeStatus(likeStatus);
    setIsLiked(likeStatus.liked);
    setLikeCount(likeStatus.likesCount);
  }

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
      queryClient.invalidateQueries({ queryKey: ['fuelReports', 'likeStatus', report.id] });
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
            <Badge variant="warning" size="sm">{t('fuelReports.status.pending')}</Badge>
          )}

          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <IoSpeedometerOutline className={`w-5 h-5 ${level.color}`} />
              <span className={`text-2xl font-bold ${level.color}`}>{fuelValue}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{t('fuelReports.unit')}</span>
            </div>
            <span className={`text-xs ${level.color}`}>{t(`fuelReports.level.${level.labelKey}`)}</span>
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
          title={isAuthenticated ? t('reviews:helpful.yes') : t('fuelReports.loginRequired')}
        >
          {isLiked ? <IoHeart className="w-5 h-5" /> : <IoHeartOutline className="w-5 h-5" />}
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        {!isAuthenticated && (
          <span className="text-xs text-neutral-400">{t('fuelReports.loginRequired')}</span>
        )}
      </div>
    </div>
  );
};

export default FuelReportCard;
