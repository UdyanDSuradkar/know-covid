/* Illustrative risk-reduction layers, combined multiplicatively. */
export const LAYERS = [
  {id:"vax",   n:"Up-to-date vaccination", s:"Current booster, within about six months", r:0.45, on:false},
  {id:"mask",  n:"Well-fitted respirator",  s:"N95, FFP2 or KN95 with a seal, worn by everyone", r:0.30, on:false},
  {id:"vent",  n:"Ventilation or filtration", s:"Open windows, or a HEPA unit sized for the room", r:0.50, on:false},
  {id:"dist",  n:"Distance and space",      s:"Two metres apart in an uncrowded room", r:0.60, on:false},
  {id:"time",  n:"Shorter exposure",        s:"Fifteen minutes instead of a full hour", r:0.35, on:false},
  {id:"test",  n:"Test before gathering",   s:"Rapid antigen test on the day", r:0.65, on:false}
];
