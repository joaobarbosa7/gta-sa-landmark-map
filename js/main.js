import { ATLAS_URL, SAT_URL, START_OFFSET, OCEAN_ATLAS, OCEAN_SAT } from "./config.js";
import { setupPins } from "./pins.js";
import { landmarks, popupHtml, areasData } from "./data.js";



const probe = new Image();
probe.src = ATLAS_URL;
probe.onload = () => {
  const W = probe.naturalWidth, H = probe.naturalHeight;
  const bounds = L.latLngBounds([[0,0],[H,W]]);

  const map = L.map("map", {
    crs: L.CRS.Simple,
    inertia: true,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    wheelPxPerZoomLevel: 120
  });
  map.createPane("areasPane");
  map.getPane("areasPane").style.zIndex = 350;


  const cat = {
    "Edifícios":  L.layerGroup().addTo(map),
    "Monumentos": L.layerGroup().addTo(map),
    "Outros":     L.layerGroup().addTo(map),
  };
  const areas = {
  "Áreas azuis":  L.layerGroup().addTo(map),
  "Áreas roxas":  L.layerGroup().addTo(map),
  };
  const STYLE = {
  azul: { color:"#2f7ed8", weight:3, fillColor:"#2f7ed8", fillOpacity:.15, interactive:false },
  roxo: { color:"#7e57c2", weight:3, fillColor:"#7e57c2", fillOpacity:.15, interactive:false },
  };


  const lb   = document.getElementById("lb");
  const lbimg= document.getElementById("lbimg");
  const prev  = document.getElementById("lbprev");
  const next  = document.getElementById("lbnext");
  
  let gallery = [], gi = 0;

  function openLightbox(urls, index=0){ gallery=urls; gi=index; lbimg.src=gallery[gi]; lb.classList.add("show"); }
  function closeLightbox(){ lb.classList.remove("show"); lbimg.src=""; gallery=[]; }
  function show(i){ gi=(i+gallery.length)%gallery.length; lbimg.src=gallery[gi]; }

  prev.addEventListener("click", e=>{ e.stopPropagation(); show(gi-1); });
  next.addEventListener("click", e=>{ e.stopPropagation(); show(gi+1); });
  document.addEventListener("keydown", e=>{
    if(!lb.classList.contains("show")) return;
    if(e.key==="ArrowLeft")  show(gi-1);
    if(e.key==="ArrowRight") show(gi+1);
    if(e.key==="Escape")     closeLightbox();
  });

  document.addEventListener("click",(e)=>{
  const img = e.target.closest("img.zoomable");
  if(img){
    e.preventDefault();
    const gal = img.closest(".gallery");
    const els = gal ? [...gal.querySelectorAll("img.zoomable")] : [img];
    openLightbox(els.map(el=>el.dataset.full||el.src), els.indexOf(img));
  } else if (e.target === lb) { closeLightbox(); }
  });



  const atlas = L.imageOverlay(ATLAS_URL, bounds, { interactive:false }).addTo(map);
  const sat   = L.imageOverlay(SAT_URL,   bounds, { interactive:false });

  const base = { "Mapa": atlas, "Satélite": sat };
const overlays = { ...cat, ...areas };
L.control.layers(base, overlays, { position:"topright", collapsed:true }).addTo(map);

const container = map.getContainer();
container.style.background = OCEAN_ATLAS;
map.on("baselayerchange", e => {
  container.style.background = (e.name === "Satélite") ? OCEAN_SAT : OCEAN_ATLAS;
});

function fitWhole(){
  const s = map.getSize();
  const fullZoom = Math.log2(Math.min(s.x/W, s.y/H));
  map.setMinZoom(fullZoom - 1);
  map.setMaxZoom(fullZoom + 5);
  map.setView([H/2, W/2], fullZoom - START_OFFSET, { animate:false });
  map.setMaxBounds(bounds.pad(0.05));
}
fitWhole();
addEventListener("resize", () => { map.invalidateSize(); fitWhole(); });

const { addPin } = setupPins(map);

// marcadores por id
const markersById = {};
landmarks.forEach(d => {
  const layer = cat[d.category] || cat["Outros"];
  const m = addPin(d.pin.x, d.pin.y, d.title, popupHtml(d), { layer });
  if (d.id) markersById[d.id] = m;
});

// áreas do data.js
areasData.forEach(a => {
  const grp  = areas[a.group] || areas["Áreas azuis"];
  const poly = L.polygon(a.coords, {
  ...(STYLE[a.style]||STYLE.azul),
  interactive:true
  }).addTo(grp);


  if (a.popup) poly.bindPopup(`<strong>${a.popup}</strong>`);
  if (a.bindTo && markersById[a.bindTo]) poly.on("click", () => markersById[a.bindTo].openPopup());
});


enableCoordClick();
};
