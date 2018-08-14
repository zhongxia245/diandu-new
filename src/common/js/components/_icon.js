export default ({ type, className = '', ...otherProps }) => (
  <svg {...otherProps} className={`icon ${className}`} aria-hidden="true">
    <use xlinkHref={`#icon-${type}`} />
  </svg>
)
