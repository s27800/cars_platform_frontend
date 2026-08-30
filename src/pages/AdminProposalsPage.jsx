import { useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  IoArrowBackOutline,
  IoCarSportOutline,
  IoCreateOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getPendingProposals, resolveProposal } from '../api/dataProposals';
import { Card, Spinner, Button, Badge, Pagination, Modal, TextArea } from '../components/ui';
import { PROPOSAL_CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/helpers';


// Helper function to get category label
const getCategoryLabel = (categoryValue, t) => {
  return t(`proposals.categories.${categoryValue}`, categoryValue);
};


// Proposal card component for admin view
const ProposalCard = ({ proposal, onApprove, onReject, isResolving, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const carInfo = proposal.carInfo;
  const changesCount = proposal.proposedValues ? Object.keys(proposal.proposedValues).length : 0;

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

        <Badge variant="warning" size="md" className="shadow-sm">
          <IoTimeOutline className="w-4 h-4 mr-1.5" />
          {t('proposals.pending')}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoPersonOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span className="font-medium">{proposal.username || `User #${proposal.userId}` || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoCalendarOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span>{formatDate(proposal.createdAt)}</span>
          </div>
          <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-md text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
            {getCategoryLabel(proposal.category, t)}
          </span>
        </div>

        {/* User comment */}
        {proposal.comment && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              {t('proposals.userComment')}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-100 dark:border-neutral-600/50 leading-relaxed">
              {proposal.comment}
            </p>
          </div>
        )}

        {/* Proposed changes */}
        {changesCount > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors ${isExpanded ? 'rotate-180' : ''}`}>
                <IoChevronDownOutline className="w-3.5 h-3.5 transition-transform" />
              </span>
              {t('proposals.proposedChanges', { count: changesCount })}
            </button>
            
            {isExpanded && (
              <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 rounded-xl">
                <div className="space-y-3">
                  {Object.entries(proposal.proposedValues).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                      <span className="font-semibold text-sm text-violet-700 dark:text-violet-400 min-w-[140px] py-1">
                        {key}:
                      </span>
                      <span className="text-violet-600 dark:text-violet-300 font-mono text-sm bg-white/70 dark:bg-violet-900/40 px-3 py-1.5 rounded-lg border border-violet-100 dark:border-violet-800/50 break-all">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApprove(proposal.id)}
            disabled={isResolving}
            loading={isResolving}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 border border-transparent hover:border-green-200 dark:hover:border-green-800 disabled:text-green-400 disabled:opacity-60"
          >
            <IoCheckmarkCircleOutline className="w-4 h-4" />
            {t('proposals.approve')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onReject(proposal)}
            disabled={isResolving}
            className="flex items-center gap-2"
          >
            <IoCloseCircleOutline className="w-4 h-4" />
            {t('proposals.reject')}
          </Button>
        </div>
      </div>
    </Card>
  );
};


// Rejection modal component
const RejectModal = ({ isOpen, onClose, onConfirm, isLoading, t }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onConfirm(comment.trim() || null);
    setComment('');
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('proposals.rejectModal.title')} size="md">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-5 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <IoCloseCircleOutline className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
            {t('proposals.rejectModal.warning')}
          </p>
        </div>
        
        <TextArea
          label={t('proposals.rejectModal.reasonLabel')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('proposals.rejectModal.reasonPlaceholder')}
          rows={3}
        />

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            {t('proposals.rejectModal.cancel')}
          </Button>
          <Button variant="danger" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {t('proposals.rejectModal.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


const AdminProposalsPage = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');

  const [page, setPage] = useState(0);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const pageSize = 10;

  // Fetch pending proposals
  const {
    data: proposalsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminPendingProposals', page, pageSize],
    queryFn: () => getPendingProposals({ page, size: pageSize, sort: 'createdAt,desc' }),
    enabled: isAuthenticated && isAdmin,
    staleTime: 30 * 1000,
  });

  // Resolve proposal mutation
  const resolveMutation = useMutation({
    mutationFn: ({ id, approve, adminComment }) => resolveProposal(id, approve, adminComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingProposals'] });
      queryClient.invalidateQueries({ queryKey: ['adminPendingProposals', page, pageSize] });
      setRejectModalOpen(false);
      setSelectedProposal(null);
    },
    onError: (error) => {
      console.error('Failed to resolve proposal:', error);
      alert(error?.response?.data?.message || 'Failed to resolve proposal. Please try again.');
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
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const proposals = proposalsData?.content || [];
  const totalPages = proposalsData?.totalPages || 0;
  const totalElements = proposalsData?.totalElements || 0;

  const handleApprove = (proposalId) => {
    resolveMutation.mutate({ id: proposalId, approve: true, adminComment: null });
  };

  const handleRejectClick = (proposal) => {
    setSelectedProposal(proposal);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = (comment) => {
    if (selectedProposal) {
      resolveMutation.mutate({ 
        id: selectedProposal.id, 
        approve: false, 
        adminComment: comment 
      });
    }
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
          {t('proposals.backToDashboard')}
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/25 dark:shadow-violet-500/10">
            <IoCreateOutline className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              {t('proposals.title')}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              {t('proposals.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{t('proposals.loading')}</p>
        </div>
      ) : error ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <IoCloseCircleOutline className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
            {t('proposals.failedToLoad')}
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            {t('proposals.retry')}
          </Button>
        </Card>
      ) : proposals.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <IoCheckmarkCircleOutline className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            {t('proposals.allCaughtUp')}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {t('proposals.noPendingProposals')}
          </p>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 px-4 py-3 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">{totalElements}</span>
              {' '}{t('proposals.pendingReview', { count: totalElements })}
            </p>
          </div>

          {/* Proposals list */}
          <div className="space-y-5">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onApprove={handleApprove}
                onReject={handleRejectClick}
                isResolving={resolveMutation.isPending}
                t={t}
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

      {/* Rejection modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedProposal(null);
        }}
        onConfirm={handleRejectConfirm}
        isLoading={resolveMutation.isPending}
        t={t}
      />
    </div>
  );
};

export default AdminProposalsPage;
