import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  IoPersonOutline, 
  IoPencilOutline, 
  IoLockClosedOutline,
  IoArrowBackOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getProfile, updateProfile, changePassword } from '../api/users';
import { Card, Tabs, Spinner, Button } from '../components/ui';
import { ProfileInfo, ProfileEditForm, PasswordChangeForm } from '../features/profile';


const ProfilePage = () => {
  const { isAuthenticated, user: authUser, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Fetch user profile data
  const { 
    data: profile, 
    isLoading, 
    error: fetchError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
      setProfileSuccess(true);
      
      // Update the auth user data
      if (updateUser && data) {
        updateUser({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      }
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordSuccess(true);
    },
  });

  // Clear success messages
  useEffect(() => {
    if (profileSuccess) {
      const timer = setTimeout(() => setProfileSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  useEffect(() => {
    setProfileSuccess(false);
    setPasswordSuccess(false);
  }, [activeTab]);

  // Redirect not authenticated user
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: { pathname: '/profile' } }} replace />;

  const handleProfileUpdate = async (values) => {
    setProfileSuccess(false);
    await updateProfileMutation.mutateAsync(values);
  };

  const handlePasswordChange = async (values) => {
    setPasswordSuccess(false);
    try {
      await changePasswordMutation.mutateAsync(values);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const userData = profile || authUser;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            to="/" 
            variant="ghost" 
            size="sm"
            leftIcon={<IoArrowBackOutline className="w-4 h-4" />}
          >
            Back to Home
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          My Profile
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {fetchError && !isLoading && (
        <Card variant="bordered" padding="lg" className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">
            Failed to load profile data. Please try again.
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries(['userProfile'])}
            variant="secondary"
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Profile Content */}
      {!isLoading && !fetchError && userData && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <ProfileInfo user={userData} />
          </div>

          {/* Right Column - Edit Forms */}
          <div className="lg:col-span-3">
            <Card variant="bordered" padding="none">
              <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List className="px-6 pt-4">
                  <Tabs.Trigger value="profile">
                    <span className="flex items-center gap-2">
                      <IoPencilOutline className="w-4 h-4" />
                      Edit Profile
                    </span>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="password">
                    <span className="flex items-center gap-2">
                      <IoLockClosedOutline className="w-4 h-4" />
                      Change Password
                    </span>
                  </Tabs.Trigger>
                </Tabs.List>

                <div className="p-6">
                  <Tabs.Content value="profile">
                    <ProfileEditForm
                      user={userData}
                      onSubmit={handleProfileUpdate}
                      isLoading={updateProfileMutation.isPending}
                      error={updateProfileMutation.error?.response?.data?.message || 
                             updateProfileMutation.error?.message}
                      success={profileSuccess}
                    />
                  </Tabs.Content>

                  <Tabs.Content value="password">
                    <PasswordChangeForm
                      onSubmit={handlePasswordChange}
                      isLoading={changePasswordMutation.isPending}
                      error={changePasswordMutation.error?.response?.data?.message || 
                             changePasswordMutation.error?.message}
                      success={passwordSuccess}
                    />
                  </Tabs.Content>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
