import useReveal from "../hooks/useReveal";

/** Fades content up the first time it enters the viewport. */
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} className={`rv ${shown ? "in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
