/* Story progress researched from the player's current in-game objective. */
const mglStoryProgress={
  "X-Men Origins: Wolverine":{
    progress:34,
    progressLabel:"La proie — Forêt d’Alkali Lake",
    progressNote:"Objectif actuel : quitter la forêt d’Alkali Lake. Estimation basée sur la position de cette séquence dans la campagne principale."
  }
};
Object.entries(mglStoryProgress).forEach(([title,data])=>{
  const game=games.find(g=>g.title===title);
  if(game) Object.assign(game,data);
});
localStorage.setItem('mgl_live',JSON.stringify(games));
render();

/* MGL Pulse V5 cinematic boot. Kept here so the existing static app needs no extra loader. */
(()=>{
  const css=document.createElement('link');
  css.rel='stylesheet'; css.href='splash.css?v=1'; document.head.appendChild(css);
  const splash=document.createElement('div');
  splash.id='mglSplash'; splash.setAttribute('aria-hidden','true');
  splash.innerHTML='<div class="sFog"></div><div class="sPulse"></div><div class="sCore"></div><div class="sRing"></div><div class="sRing r2"></div><div class="sSpark s1"></div><div class="sSpark s2"></div><div class="sSpark s3"></div><div class="sSpark s4"></div><div class="sLogo"><img src="assets/logos/mgl-mark.svg" alt=""></div><div class="sLine"></div>';
  document.body.prepend(splash);
  setTimeout(()=>splash.remove(),3300);
})();