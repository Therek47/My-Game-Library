// Small runtime overrides for centrally managed MGL updates.
(()=>{
  try {
    const dr2=games.find(x=>x.title==='Dead Rising 2');
    if(dr2){
      // Current platform / presentation: PS4 version played on PS5 Pro.
      Object.assign(dr2,{
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

      const dr2Marker='mgl_dr2_ps5_current_20261004';
      if(!localStorage.getItem(dr2Marker)){
        dr2.status='En cours';
        dr2.note='Version PS4 jouée sur PS5 Pro • Partie en cours';
        localStorage.setItem('mgl_current_game','Dead Rising 2');
        localStorage.setItem(dr2Marker,'1');
      }
    }

    const sr3=games.find(x=>x.title==='Saints Row: The Third Remastered');
    if(sr3){
      const sr3Marker='mgl_sr3_current_20261004';
      if(!localStorage.getItem(sr3Marker)){
        sr3.status='En cours';
        localStorage.setItem('mgl_current_game','Saints Row: The Third Remastered');
        localStorage.setItem(sr3Marker,'1');
      }
    }

    let control=games.find(x=>x.title==='Control Ultimate Edition');
    if(!control){
      control={
        title:'Control Ultimate Edition',
        platform:'PC • Steam',
        status:'En cours',
        compat:'Fonctionnel',
        year:'2020',
        genre:'Action-aventure / TPS / Surnaturel',
        developer:'Remedy Entertainment',
        saga:'Control',
        note:'Partie en cours sur ROG Xbox Ally X',
        hours:'',
        rating:'',
        favorite:false
      };
      games.push(control);
    }
    Object.assign(control,{
      folder:'rog-pc',
      bestDevice:'ROG Xbox Ally X',
      bestMethod:'PC natif • Steam',
      sourcePlatform:'PC',
      coverPlatform:'PC • Steam',
      poster:'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/library_600x900.jpg',
      artwork:'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/library_hero.jpg',
      posterPosition:'50% center',
      artworkPosition:'center',
      cover:'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/library_600x900.jpg'
    });

    const controlMarker='mgl_control_current_20261005';
    if(!localStorage.getItem(controlMarker)){
      control.status='En cours';
      localStorage.setItem('mgl_current_game','Control Ultimate Edition');
      localStorage.setItem(controlMarker,'1');
    }

    // Persist the current library state, including the user's existing edits.
    localStorage.setItem('mgl_live',JSON.stringify(games));
    render();
  } catch(e) {
    console.warn('MGL override skipped',e);
  }
})();
