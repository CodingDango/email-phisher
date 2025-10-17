export default function Button({
  btnType = 'primary',
  Icon = undefined,
  iconSize = 16,
  text,
  ...rest
}) {
  const baseButtonClasses = `
    px-4 py-2 rounded-md cursor-pointer hover:brightness-90 
    flex gap-2 items-center justify-center
  `;

  let additionalButtonClasses = null;

  if (btnType === 'primary') {
    additionalButtonClasses = 'bg-primary text-white';
  } else if (btnType === 'ghost') {
    additionalButtonClasses = 'border border-primary text-primary';
  }

  return (
    <button {...rest} className={`${baseButtonClasses} ${additionalButtonClasses}`}>
      {Icon && <Icon size={iconSize}/>}
      {text}
    </button>
  );
}