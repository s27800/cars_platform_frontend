import { Link } from 'react-router-dom';
import {
  IoChevronForwardOutline,
  IoCarSportOutline,
  IoLayersOutline,
} from 'react-icons/io5';


const ModelCard = ({ model }) => {
  const { id, name, generationsCount = 0 } = model;

  return (
    <Link
      to={`/models/${id}`}
      className="relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md group"
    >

      {/* Model icon/placeholder */}
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
        <IoCarSportOutline className="w-6 h-6" />
      </div>

      {/* Model name */}
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 pr-6">
        {name}
      </h3>

      {/* Generations count */}
      <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
        <IoLayersOutline className="w-4 h-4" />
        <span>{generationsCount} {generationsCount === 1 ? 'generation' : 'generations'}</span>
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-4 right-4">
        <IoChevronForwardOutline className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
      </div>
    </Link>
  );
};


const ModelsGrid = ({ models }) => {
  const sortedModels = [...models].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedModels.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
        />
      ))}
    </div>
  );
};


export default ModelsGrid;
