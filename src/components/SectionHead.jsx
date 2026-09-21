import Reveal from "./Reveal";

export default function SectionHead({ kicker, title, id, badge, children }) {
  return (
    <Reveal className="sec-head">
      <div className="sec-head-row">
        {kicker && <span className="sec-kicker">{kicker}</span>}
        {badge}
      </div>
      <h2 className="sec-title" id={id}>{title}</h2>
      {children && <p className="lede">{children}</p>}
    </Reveal>
  );
}
