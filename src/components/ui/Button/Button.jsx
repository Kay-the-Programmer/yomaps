import { forwardRef } from 'react'
import styles from './Button.module.css'

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
  ...rest
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
