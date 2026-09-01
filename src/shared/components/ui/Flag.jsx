import { useId } from 'react';


// Flag of the United Kingdom
const FlagGB = ({ className }) => {
  const id = useId();

  return (
    <svg className={className} viewBox="0 0 60 30" role="presentation">
      <clipPath id={`${id}-border`}><path d="M0,0 v30 h60 v-30 z" /></clipPath>
      <clipPath id={`${id}-diagonals`}><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
      <g clipPath={`url(#${id}-border)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-diagonals)`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
};

// Flag of Poland
const FlagPL = ({ className }) => (
  <svg className={className} viewBox="0 0 16 10" role="presentation">
    <rect width="16" height="5" fill="#fff" />
    <rect y="5" width="16" height="5" fill="#DC143C" />
  </svg>
);

const FLAGS = {
  en: FlagGB,
  pl: FlagPL,
};

/**
 * Flag of the country a UI language belongs to.
 *
 * @param {object} props - Component props
 * @param {string} props.code - language code, 'en' or 'pl'
 * @param {string} props.className - sizing and styling classes
 */
const Flag = ({ code, className = 'w-5 h-4 rounded-sm shadow-sm' }) => {
  const FlagShape = FLAGS[code];

  return FlagShape ? <FlagShape className={className} /> : null;
};

export default Flag;
