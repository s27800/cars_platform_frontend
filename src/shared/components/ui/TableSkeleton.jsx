import Skeleton from './Skeleton';


// Skeleton placeholder for table rows
const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = ''
}) => {
  return (
    <div className={`overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 ${className}`}>
      <table className="w-full">
        {showHeader && (
          <thead className="bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton variant="text" className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="bg-white dark:bg-neutral-900">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton
                    variant="text"
                    className={`h-4 ${colIndex === 0 ? 'w-32' : 'w-24'}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default TableSkeleton;
