
// User avatar with image or initials fallback
const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const avatarStyles = `
    rounded-full flex items-center justify-center
    bg-primary-500 text-white font-medium
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }

  return (
    <div className={avatarStyles} {...props}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
