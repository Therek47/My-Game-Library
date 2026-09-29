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