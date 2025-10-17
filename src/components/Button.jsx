export default function Button({
  type = 'primary',
  Icon = undefined,
  iconSize = 16,
  text,
  ...rest
}) {
  const baseButtonClasses = `
    px-4 py-2 rounded-md cursor-pointer hover:brightness-90 
    flex gap-2 items-center
  `;

  let additionalButtonClasses = null;

  if (type === 'primary') {
    additionalButtonClasses = 'bg-primary text-white';
  } else if (type === 'ghost') {
    additionalButtonClasses = 'border border-primary text-primary';
  }

  return (
    <button {...rest} className={`${baseButtonClasses} ${additionalButtonClasses}`}>
      {Icon && <Icon size={iconSize}/>}
      {text}
    </button>
  );
}