import { useTranslation } from 'react-i18next';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';


// Page navigation with a summary of the range being shown
const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
  showInfo = true,
  className = '',
}) => {
  const { t } = useTranslation('common');

  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1)
    startPage = Math.max(0, endPage - maxVisiblePages + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const buttonBase = `
    flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const buttonInactive = `
    ${buttonBase}
    bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300
    hover:bg-neutral-100 dark:hover:bg-neutral-700
    border border-neutral-200 dark:border-neutral-700
  `;

  const buttonActive = `
    ${buttonBase}
    bg-primary-600 text-white
    border border-primary-600
  `;

  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {showInfo && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('pagination.showing', { start: startIndex, end: endIndex, total: totalElements })}
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={buttonInactive}
          aria-label={t('a11y.previousPage')}
        >
          <IoChevronBackOutline className="w-4 h-4" />
        </button>

        {startPage > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className={buttonInactive}
            >
              1
            </button>
            {startPage > 1 && (
              <span className="px-2 text-neutral-400">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={page === currentPage ? buttonActive : buttonInactive}
          >
            {page + 1}
          </button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && (
              <span className="px-2 text-neutral-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className={buttonInactive}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={buttonInactive}
          aria-label={t('a11y.nextPage')}
        >
          <IoChevronForwardOutline className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
