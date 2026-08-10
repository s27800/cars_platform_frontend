import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline, IoFilterOutline, IoChevronDownOutline } from 'react-icons/io5';
import { getBrands, getBrandById } from '../../api/brands';
import { getModelById } from '../../api/models';
import { getBodyTypes } from '../../api/bodyTypes';
import { getTags } from '../../api/tags';
import { Select, Input, Button, Checkbox } from '../ui';


const ENGINE_TYPE_VALUES = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const DRIVE_TYPE_VALUES = ['FWD', 'RWD', 'AWD'];
const TRANSMISSION_TYPE_VALUES = ['Manual', 'Automatic'];


const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-neutral-900 dark:text-white"
      >
        {title}
        <IoChevronDownOutline className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};


const FiltersPanel = ({
  filters,
  onFiltersChange,
  onReset,
  isMobile = false,
  onClose,
}) => {
  const { t } = useTranslation('cars');
  const [selectedBrandId, setSelectedBrandId] = useState(filters.brandIds?.[0] || '');
  const [selectedModelId, setSelectedModelId] = useState(filters.modelIds?.[0] || '');
  const [models, setModels] = useState([]);
  const [generations, setGenerations] = useState([]);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bodyTypes = [] } = useQuery({
    queryKey: ['bodyTypes'],
    queryFn: getBodyTypes,
    staleTime: 5 * 60 * 1000,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const fetchModels = async () => {
      if (selectedBrandId) {
        try {
          const brandData = await getBrandById(selectedBrandId);
          setModels(brandData.models || []);
        } catch (error) {
          console.error('Failed to fetch models:', error);
          setModels([]);
        }
      } else {
        setModels([]);
        setGenerations([]);
      }
    };
    fetchModels();
  }, [selectedBrandId]);

  useEffect(() => {
    const fetchGenerations = async () => {
      if (selectedModelId) {
        try {
          const modelData = await getModelById(selectedModelId);
          setGenerations(modelData.generations || []);
        } catch (error) {
          console.error('Failed to fetch generations:', error);
          setGenerations([]);
        }
      } else {
        setGenerations([]);
      }
    };
    fetchGenerations();
  }, [selectedModelId]);

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrandId(brandId);
    setSelectedModelId('');
    setGenerations([]);
    onFiltersChange({
      ...filters,
      brandIds: brandId ? [Number(brandId)] : [],
      modelIds: [],
      generationIds: [],
    });
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModelId(modelId);
    onFiltersChange({
      ...filters,
      modelIds: modelId ? [Number(modelId)] : [],
      generationIds: [],
    });
  };

  const handleGenerationChange = (e) => {
    const generationId = e.target.value;
    onFiltersChange({
      ...filters,
      generationIds: generationId ? [Number(generationId)] : [],
    });
  };

  const handleBodyTypeToggle = (bodyTypeId) => {
    const currentIds = filters.bodyTypeIds || [];
    const newIds = currentIds.includes(bodyTypeId)
      ? currentIds.filter(id => id !== bodyTypeId)
      : [...currentIds, bodyTypeId];
    onFiltersChange({ ...filters, bodyTypeIds: newIds });
  };

  const handleEngineTypeToggle = (engineType) => {
    const currentTypes = filters.engineTypes || [];
    const newTypes = currentTypes.includes(engineType)
      ? currentTypes.filter(t => t !== engineType)
      : [...currentTypes, engineType];
    onFiltersChange({ ...filters, engineTypes: newTypes });
  };

  const handleDriveToggle = (drive) => {
    const currentDrives = filters.drives || [];
    const newDrives = currentDrives.includes(drive)
      ? currentDrives.filter(d => d !== drive)
      : [...currentDrives, drive];
    onFiltersChange({ ...filters, drives: newDrives });
  };

  const handleTransmissionToggle = (transmission) => {
    const currentTransmissions = filters.transmissionTypes || [];
    const newTransmissions = currentTransmissions.includes(transmission)
      ? currentTransmissions.filter(t => t !== transmission)
      : [...currentTransmissions, transmission];
    onFiltersChange({ ...filters, transmissionTypes: newTransmissions });
  };

  const handleTagToggle = (tagId) => {
    const currentIds = filters.tagIds || [];
    const newIds = currentIds.includes(tagId)
      ? currentIds.filter(id => id !== tagId)
      : [...currentIds, tagId];
    onFiltersChange({ ...filters, tagIds: newIds });
  };

  const handleRangeChange = (field, value) => {
    const numValue = value === '' ? undefined : Number(value);
    onFiltersChange({ ...filters, [field]: numValue });
  };

  const brandOptions = brands.map(b => ({ value: b.id.toString(), label: b.name }));
  const modelOptions = models.map(m => ({ value: m.id.toString(), label: m.name }));
  const generationOptions = generations.map(g => ({
    value: g.id.toString(),
    label: `${g.name} (${g.startYear}${g.endYear ? `-${g.endYear}` : '+'})`
  }));

  const activeFiltersCount = [
    filters.brandIds?.length,
    filters.modelIds?.length,
    filters.generationIds?.length,
    filters.bodyTypeIds?.length,
    filters.engineTypes?.length,
    filters.drives?.length,
    filters.transmissionTypes?.length,
    filters.tagIds?.length,
    filters.minPower,
    filters.maxPower,
    filters.minDisplacement,
    filters.maxDisplacement,
  ].filter(Boolean).length;

  const content = (
    <div className="space-y-1">
      <FilterSection title={t('filters.brandModelGeneration')}>
        <Select
          placeholder={t('filters.selectBrand')}
          options={brandOptions}
          value={selectedBrandId}
          onChange={handleBrandChange}
        />
        <Select
          placeholder={t('filters.selectModel')}
          options={modelOptions}
          value={selectedModelId}
          onChange={handleModelChange}
          disabled={!selectedBrandId}
        />
        <Select
          placeholder={t('filters.selectGeneration')}
          options={generationOptions}
          value={filters.generationIds?.[0]?.toString() || ''}
          onChange={handleGenerationChange}
          disabled={!selectedModelId}
        />
      </FilterSection>

      <FilterSection title={t('filters.bodyType')}>
        <div className="space-y-2">
          {bodyTypes.map((bodyType) => (
            <Checkbox
              key={bodyType.id}
              label={t(`bodyTypes.${bodyType.name}`, bodyType.name)}
              checked={(filters.bodyTypeIds || []).includes(bodyType.id)}
              onChange={() => handleBodyTypeToggle(bodyType.id)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('filters.engineType')}>
        <div className="space-y-2">
          {ENGINE_TYPE_VALUES.map((value) => (
            <Checkbox
              key={value}
              label={t(`engineTypes.${value}`)}
              checked={(filters.engineTypes || []).includes(value)}
              onChange={() => handleEngineTypeToggle(value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('filters.driveType')}>
        <div className="space-y-2">
          {DRIVE_TYPE_VALUES.map((value) => (
            <Checkbox
              key={value}
              label={t(`driveTypes.${value}`)}
              checked={(filters.drives || []).includes(value)}
              onChange={() => handleDriveToggle(value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('filters.transmission')}>
        <div className="space-y-2">
          {TRANSMISSION_TYPE_VALUES.map((value) => (
            <Checkbox
              key={value}
              label={t(`transmissionTypes.${value}`)}
              checked={(filters.transmissionTypes || []).includes(value)}
              onChange={() => handleTransmissionToggle(value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('filters.powerRange')} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder={t('filters.min')}
            value={filters.minPower || ''}
            onChange={(e) => handleRangeChange('minPower', e.target.value)}
            size="sm"
          />
          <Input
            type="number"
            placeholder={t('filters.max')}
            value={filters.maxPower || ''}
            onChange={(e) => handleRangeChange('maxPower', e.target.value)}
            size="sm"
          />
        </div>
      </FilterSection>

      <FilterSection title={t('filters.displacementRange')} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder={t('filters.min')}
            value={filters.minDisplacement || ''}
            onChange={(e) => handleRangeChange('minDisplacement', e.target.value)}
            size="sm"
          />
          <Input
            type="number"
            placeholder={t('filters.max')}
            value={filters.maxDisplacement || ''}
            onChange={(e) => handleRangeChange('maxDisplacement', e.target.value)}
            size="sm"
          />
        </div>
      </FilterSection>

      {tags.length > 0 && (
        <FilterSection title={t('filters.tags')} defaultOpen={false}>
          <div className="space-y-2">
            {tags.map((tag) => (
              <Checkbox
                key={tag.id}
                label={tag.name}
                checked={(filters.tagIds || []).includes(tag.id)}
                onChange={() => handleTagToggle(tag.id)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {activeFiltersCount > 0 && (
        <div className="pt-4">
          <Button
            variant="ghost"
            fullWidth
            onClick={onReset}
            leftIcon={<IoCloseOutline className="w-4 h-4" />}
          >
            {t('filters.clearAllCount', { count: activeFiltersCount })}
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
        <div 
          className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-neutral-900 shadow-xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoFilterOutline className="w-5 h-5" />
              <span className="font-semibold">{t('filters.title')}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <IoFilterOutline className="w-5 h-5 text-primary-600" />
        <span className="font-semibold text-neutral-900 dark:text-white">Filters</span>
      </div>
      {content}
    </div>
  );
};

export default FiltersPanel;
