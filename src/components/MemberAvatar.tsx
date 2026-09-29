import React, { useState } from 'react';

interface MemberAvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function getInitials(name: string): string {
  if (!name) return 'LIA';
  const cleanName = name.replace(/^Rtr\.\s*/i, '').replace(/^PP\.\s*/i, '').replace(/^IPP\.\s*/i, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'LIA';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  src,
  name,
  className = '',
  size = 'md',
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-3xl',
  };

  const containerSize = sizeClasses[size] || sizeClasses.md;

  if (src && !imageFailed) {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-[#0B1728] border border-white/10 shadow-lg ${containerSize} ${className}`}>
        <img
          src={src}
          alt={`Photo of ${name}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
          onError={() => setImageFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1728] via-[#10233D] to-[#1A365D] border border-[#D7B65A]/30 shadow-lg text-[#E8D89A] font-heading font-extrabold tracking-wider select-none ${containerSize} ${className}`}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      <div className="absolute inset-0 bg-[#D7B65A]/5 rounded-2xl blur-sm" />
      <span className="relative z-10 drop-shadow-md">{initials}</span>
    </div>
  );
};
