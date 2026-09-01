import { useTranslation } from 'react-i18next';
import {
  IoPersonOutline,
  IoMailOutline,
  IoAtOutline,
} from 'react-icons/io5';
import { Card, Avatar } from '../../shared/components/ui';


// Read-only summary of the account
const ProfileInfo = ({ user }) => {
  const { t } = useTranslation('profile');

  if (!user)
    return null;

  const infoItems = [
    {
      icon: <IoAtOutline className="w-5 h-5" />,
      label: t('editProfile.username'),
      value: user.username,
    },
    {
      icon: <IoMailOutline className="w-5 h-5" />,
      label: t('editProfile.email'),
      value: user.email,
    },
    {
      icon: <IoPersonOutline className="w-5 h-5" />,
      label: t('editProfile.firstName'),
      value: user.firstName || t('common:notSet'),
    },
    {
      icon: <IoPersonOutline className="w-5 h-5" />,
      label: t('editProfile.lastName'),
      value: user.lastName || t('common:notSet'),
    },
  ];

  return (
    <Card variant="bordered" padding="lg">
      <div className="flex flex-col items-center mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
        <Avatar
          name={user.firstName || user.username}
          size="xl"
          className="mb-4"
        />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          @{user.username}
        </p>
      </div>

      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/30"
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
                {item.label}
              </p>
              <p className="text-neutral-900 dark:text-white font-medium truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileInfo;
