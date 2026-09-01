import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';


// Reads the theme context and fails loudly outside its provider
const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export default useTheme;
