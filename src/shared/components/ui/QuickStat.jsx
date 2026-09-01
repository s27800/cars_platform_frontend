/**
 * Single figure with an icon and a caption, used in the summary rows on the
 * brand, model and generation pages.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.icon - icon shown above the figure
 * @param {string} props.label - caption under the figure
 * @param {React.ReactNode} props.value - the figure itself
 */
const QuickStat = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-center">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
      {value}
    </div>
    <div className="text-sm text-neutral-500 dark:text-neutral-400">
      {label}
    </div>
  </div>
);

export default QuickStat;
