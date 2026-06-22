const variants = {
  primary:
    'bg-primary text-primary-foreground hover:brightness-110 active:brightness-95',
  secondary:
    'border border-border-subtle bg-card text-foreground hover:bg-accent active:bg-muted',
  ghost: 'text-foreground hover:bg-accent active:bg-muted',
}

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-9 gap-2 px-4 text-sm',
  lg: 'h-10 gap-2 px-5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md font-medium transition-[background,filter] duration-150 ease-out studio-focus-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
