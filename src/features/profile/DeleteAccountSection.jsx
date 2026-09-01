import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoTrashOutline, IoWarningOutline } from 'react-icons/io5';
import { deleteAccount } from './api';
import { useAuth } from '../../shared/hooks';
import { Button, ConfirmModal, Alert } from '../../shared/components/ui';


/**
 * Danger zone section for account deletion.
 * Shows a warning about the irreversible action and requires confirmation.
 */
const DeleteAccountSection = () => {
  const { t } = useTranslation('profile');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout();
      navigate('/', { replace: true });
    },
    onError: (err) => {
      setError(err.response?.data?.message || t('deleteAccount.error'));
      setShowConfirm(false);
    },
  });

  const handleDeleteConfirm = () => {
    setError(null);
    deleteMutation.mutate();
  };

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">

      {/* Danger Zone Header */}
      <div className="flex items-center gap-2 mb-4">
        <IoWarningOutline className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
          {t('common:dangerZone')}
        </h3>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Delete Account Card */}
      <div className="p-4 border-2 border-red-200 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-white mb-1">
              {t('deleteAccount.title')}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('deleteAccount.description')}
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<IoTrashOutline className="w-4 h-4" />}
            onClick={() => setShowConfirm(true)}
            className="shrink-0"
          >
            {t('deleteAccount.confirm')}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteAccount.title')}
        message={t('deleteAccount.warning')}
        confirmText={t('deleteAccount.confirm')}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default DeleteAccountSection;
