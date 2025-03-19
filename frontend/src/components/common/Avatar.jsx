const Avatar = ({ 
    name, 
    src, 
    size = 'md',
    className = '' 
  }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-16 h-16 text-lg'
    };
    
    const initials = name
      ? name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      : '';
    
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full overflow-hidden bg-primary-100 text-primary-700 font-medium ${className}`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };
  
  export default Avatar;
  