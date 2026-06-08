import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  IoCarSportOutline,
  IoCreateOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import { getUserDataProposals } from '../../api/users';
import { Card, Spinner, Button, Badge, Pagination } from '../../components/ui';
import { PROPOSAL_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';


const UserDataProposalsList = () => {
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const {
    data: proposalsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userDataProposals', page, pageSize],
    queryFn: () => getUserDataProposals({ page, size: pageSize, sort: 'createdAt,desc' }),
    staleTime: 30000,
  });

  const proposals = proposalsData?.content || [];
  const totalPages = proposalsData?.totalPages || 0;
  const totalElements = proposalsData?.totalElements || 0;

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
          Failed to load your data proposals. Please try again.
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Empty State
  if (proposals.length === 0) {
    return (
      <div className="text-center py-8">
        <IoCreateOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          No data proposals yet
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          You haven't submitted any data change proposals yet.
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
        {totalElements} {totalElements === 1 ? 'proposal' : 'proposals'} submitted
      </p>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <UserDataProposalCard key={proposal.id} proposal={proposal} />
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
    </div>
  );
};


// Helper function to get status badge config
const getStatusConfig = (status) => {
  switch (status) {
    case 'APPROVED':
      return {
        variant: 'success',
        label: 'Approved',
        icon: IoCheckmarkCircleOutline,
      };
    case 'REJECTED':
      return {
        variant: 'danger',
        label: 'Rejected',
        icon: IoCloseCircleOutline,
      };
    case 'PENDING':
    default:
      return {
        variant: 'warning',
        label: 'Pending',
        icon: IoTimeOutline,
      };
  }
};

// Helper function to get category label
const getCategoryLabel = (categoryValue) => {
  const category = PROPOSAL_CATEGORIES.find(cat => cat.value === categoryValue);
  return category?.label || categoryValue;
};


// Card component for displaying user's data proposal with car info
const UserDataProposalCard = ({ proposal }) => {
  const carInfo = proposal.carInfo;
  const statusConfig = getStatusConfig(proposal.status);
  const StatusIcon = statusConfig.icon;

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

        <Badge variant={statusConfig.variant} size="sm">
          <StatusIcon className="w-3.5 h-3.5 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Proposal Content */}
      <div className="p-4">

        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {getCategoryLabel(proposal.category)}
          </span>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(proposal.createdAt)}
          </p>
        </div>

        {/* Comment */}
        {proposal.comment && (
          <div className="mb-3">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Your comment:</p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
              {proposal.comment}
            </p>
          </div>
        )}

        {/* Proposed Changes Preview */}
        {proposal.proposedValues && Object.keys(proposal.proposedValues).length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Proposed changes:</p>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
              <pre className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(proposal.proposedValues, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Admin Comment */}
        {proposal.status === 'REJECTED' && proposal.adminComment && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <IoInformationCircleOutline className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                  Admin feedback:
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {proposal.adminComment}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resolved Date */}
        {proposal.resolvedAt && (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            {proposal.status === 'APPROVED' ? 'Approved' : 'Rejected'} on {formatDate(proposal.resolvedAt)}
          </p>
        )}
      </div>
    </Card>
  );
};


export default UserDataProposalsList;
