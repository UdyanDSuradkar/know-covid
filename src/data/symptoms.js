export const SYMPTOMS = [
  {n:"Sore throat",       p:"~70%", part:"throat", d:"The most common first sign in Omicron-era infections, often before any fever."},
  {n:"Blocked or runny nose", p:"~65%", part:"nose", d:"Frequently mistaken for hay fever or a common cold."},
  {n:"Cough",             p:"~60%", part:"chest", d:"Usually dry and persistent rather than productive."},
  {n:"Headache",          p:"~55%", part:"head", d:"Often described as pressure across the forehead and behind the eyes."},
  {n:"Fatigue",           p:"~50%", part:"torso", d:"Can outlast every other symptom by weeks, and is the core complaint in long COVID."},
  {n:"Muscle aches",      p:"~40%", part:"legs",  d:"Widespread aching, most noticeable in the back and thighs."},
  {n:"Fever or chills",   p:"~35%", part:"head",  d:"Less universal than in 2020; many infections now run without one."},
  {n:"Loss of taste or smell", p:"~10%", part:"nose", d:"Defined the early pandemic. Far rarer since Omicron, but slower to resolve when it happens."},
  {n:"Breathlessness",    p:"~8%",  part:"chest", d:"A warning sign. Shortness of breath at rest needs urgent assessment.", urgent:true}
];

export const BODY_PARTS = {
  head:{x:100,y:36}, nose:{x:100,y:52}, throat:{x:100,y:76},
  chest:{x:100,y:118}, torso:{x:100,y:172}, legs:{x:80,y:288}
};
