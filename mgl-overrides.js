// Small runtime overrides for centrally managed MGL updates.
(()=>{
  try {
    const g=games.find(x=>x.title==='Dead Rising 2');
    if(!g) return;

    // Current platform / presentation: PS4 version played on PS5 Pro.
    Object.assign(g,{
      platform:'PS5 Pro • PS4',
      folder:'ps5',
      bestDevice:'PS5 Pro',
      bestMethod:'Version PS4 rétrocompatible',
      sourcePlatform:'PS4',
      coverPlatform:'PS4 • joué sur PS5 Pro',
      poster:'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/45740/library_600x900.jpg',
      artwork:'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/45740/library_hero.jpg',
      posterPosition:'50% center',
      artworkPosition:'center',
      cover:'https://cdn.awsli.com.br/2500x2500/241/241991/produto/13189275/6fe0fb17ad.jpg'
    });

    // Apply the "now playing" change once, without preventing later manual changes.
    const marker='mgl_dr2_ps5_current_20261004';
    if(!localStorage.getItem(marker)){
      g.status='En cours';
      g.note='Version PS4 jouée sur PS5 Pro • Partie en cours';
      localStorage.setItem('mgl_current_game','Dead Rising 2');
      localStorage.setItem(marker,'1');
    }

    // Persist the current library state, including the user's existing edits.
    localStorage.setItem('mgl_live',JSON.stringify(games));
    render();
  } catch(e) {
    console.warn('MGL override skipped',e);
  }
})();
