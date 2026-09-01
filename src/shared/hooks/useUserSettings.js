import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../contexts/AuthContext';
import * as userSettingsApi from '../api/userSettings';
import { STALE_TIME } from '../utils/constants';


/**
 * Account-level preferences (theme, language).
 * Both theme and language provider need them right after login.
 *
 * @returns {{settings: object|undefined, isLoading: boolean}}
 */
const useUserSettings = () => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  const { data: settings, isLoading } = useQuery({
    queryKey: ['user', 'settings'],
    queryFn: userSettingsApi.getSettings,
    enabled: isAuthenticated,
    staleTime: STALE_TIME.LONG,
    retry: false,
  });

  return { settings, isLoading: isAuthenticated && isLoading };
};

export default useUserSettings;
