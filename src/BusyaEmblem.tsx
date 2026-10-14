import type { Achievement } from './achievements';

// Vector artwork stays crisp at both the small collection size and full badge size.
export default function BusyaEmblem({ tier }: { tier: Achievement['id'] }) {
  const star = 'M50 24 57 40 75 42 62 54 66 72 50 63 34 72 38 54 25 42 43 40Z';
  return <svg className="busya-emblem" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    {tier === 'first' && <>
      <path d="m29 61-7 32 22-11 6 12 8-32" fill="#397fc0"/><path d="m56 61 4 32 10-12 18 6-14-28" fill="#73cce8"/>
      <circle cx="50" cy="45" r="34" fill="#b77a25"/><circle cx="50" cy="43" r="29" fill="#f8c65d" stroke="#fff1b0" strokeWidth="3"/>
      <path d={star} transform="translate(10 9) scale(.8)" fill="#a96220" stroke="#fff1b0" strokeWidth="2"/>
    </>}
    {tier === 'beyond' && <>
      <path d="m50 4 10 12 16-3 3 17 14 9-9 14 4 18-18 4-9 17-14-8-17 7-6-18-16-9 9-16-4-17 19-6Z" fill="#85e4fc" stroke="#318ac7" strokeWidth="3"/>
      <path d="M23 41 50 18 77 41 50 81Z" fill="#168abb" stroke="#c6f8ff" strokeWidth="3"/>
      <path d="m57 28-21 25h13l-5 19 24-30H54Z" fill="#ffdf76" stroke="#fff5cc" strokeWidth="1.5"/>
      <path d="m14 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM85 78l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f9d774"/>
    </>}
    {tier === 'summit' && <>
      <path d="M29 65C6 64 3 42 5 30l28 11M71 65c23-1 26-23 24-35L67 41" fill="#ac74dd" stroke="#e4c2ff" strokeWidth="2"/>
      <path d="m8 41 18 10M11 52l18 6m63-17L74 51m15 1-18 6" stroke="#7543a6" strokeWidth="3"/>
      <path d="M50 8 78 24 73 69 50 91 27 69 22 24Z" fill="#6533a6" stroke="#e4b6ff" strokeWidth="3"/>
      <path d="m31 35 10 9 9-17 9 17 10-9-5 29H36Z" fill="#ffd26c" stroke="#fff0ae" strokeWidth="2"/>
      <path d="m50 44 7 9-7 9-7-9Z" fill="#ff79b4"/><circle cx="50" cy="19" r="3" fill="#fff0ae"/>
      <path d="m85 6 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffcf72"/>
    </>}
    {tier === 'ultra' && <>
      <path d="m50 2 9 12 15-6 3 17 17 3-6 15 10 9-14 9 6 16-17 2-5 17-15-8-12 10-8-15-18 4-1-18L2 59l11-13L5 32l17-5 3-17 16 5Z" fill="#f6aa47" stroke="#ffe1a4" strokeWidth="2"/>
      <path d="M27 76C10 69 9 45 12 36l23 12m38 28c17-7 18-31 15-40L65 48" fill="#ef6e91" stroke="#ffc4cf" strokeWidth="2"/>
      <path d="M50 14 77 34 70 71 50 88 30 71 23 34Z" fill="#673ba6" stroke="#ffe9b4" strokeWidth="3"/>
      <path d="m50 28 19 22-19 28-19-28Z" fill="#69e3df" stroke="#d5fffa" strokeWidth="2"/>
      <path d="m50 28 1 22 18 0m-38 0h20l-1 28" stroke="#2099b6" strokeWidth="2"/>
      <path d="m30 28 10 7 10-16 10 16 10-7-4 16H34Z" fill="#ffd56e" stroke="#fff1bf" strokeWidth="2"/>
      <path d="m10 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm79 69 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#fff1ba"/>
    </>}
  </svg>;
}
