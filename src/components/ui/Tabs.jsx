import { useState, createContext, useContext } from 'react';


// Context for sharing tab state between components
const TabsContext = createContext(null);


// Reusable main Tabs component
const Tabs = ({
  defaultValue,
  value,
  onChange,
  className = '',
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalValue;
  
  const handleChange = (newValue) => {
    if (value === undefined)
      setInternalValue(newValue);

    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};


// Container for tab trigger buttons
const TabsList = ({ className = '', children }) => {
  return (
    <div 
      className={`
        flex border-b border-neutral-200 dark:border-neutral-700
        ${className}
      `}
      role="tablist"
    >
      {children}
    </div>
  );
};


// Individual tab trigger button
const TabsTrigger = ({ value, className = '', disabled = false, children }) => {
  const context = useContext(TabsContext);
  
  if (!context)
    throw new Error('Tabs.Trigger must be used within a Tabs component');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0
        border-b-2 -mb-px transition-colors
        ${isActive 
          ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
          : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};


// Container for tab content panels
const TabsContent = ({ value, className = '', children }) => {
  const context = useContext(TabsContext);
  
  if (!context)
    throw new Error('Tabs.Content must be used within a Tabs component');

  const { activeTab } = context;
  
  if (activeTab !== value)
    return null;

  return (
    <div 
      role="tabpanel"
      className={`pt-4 ${className}`}
    >
      {children}
    </div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
