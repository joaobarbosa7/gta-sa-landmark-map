import { ATLAS_URL, SAT_URL, START_OFFSET, OCEAN_ATLAS, OCEAN_SAT } from "./config.js";
import { setupPins } from "./pins.js";

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

  const lb   = document.getElementById("lb");
  const lbimg= document.getElementById("lbimg");

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".zoomable");
    if (img) {                       // abrir
      e.preventDefault();
      lbimg.src = img.dataset.full || img.src;
      lb.classList.add("show");
    } else if (e.target === lb) {    // fechar ao clicar no fundo
      lb.classList.remove("show");
      lbimg.src = "";
    }
  });


  const atlas = L.imageOverlay(ATLAS_URL, bounds, { interactive:false }).addTo(map);
  const sat   = L.imageOverlay(SAT_URL,   bounds, { interactive:false });

  L.control.layers({ "Mapa": atlas, "Satélite": sat }, {}, { position:"topright", collapsed:true }).addTo(map);

  const container = map.getContainer();
  container.style.background = OCEAN_ATLAS;
  map.on("baselayerchange", e => {
    container.style.background = (e.name === "Satélite") ? OCEAN_SAT : OCEAN_ATLAS;
  });

  function fitWhole() {
    const s = map.getSize();
    const scale = Math.min(s.x / W, s.y / H);
    const fullZoom = Math.log2(scale);
    map.setMinZoom(fullZoom - 1);
    map.setMaxZoom(fullZoom + 5);
    map.setView([H/2, W/2], fullZoom - START_OFFSET, { animate:false });
    map.setMaxBounds(bounds.pad(0.05));
  }
  fitWhole();
  addEventListener("resize", () => { map.invalidateSize(); fitWhole(); });

  const { addPin, enableCoordClick } = setupPins(map);
  const pinIcon = L.icon({
  iconUrl: ".//assets/pin.png",
  iconSize: [24, 36],      // ajusta ao teu ficheiro
  iconAnchor: [12, 36],    // base do pino
  popupAnchor: [0, -30]
});

  addPin(W/2, H/2, "Centro", "Pino de teste");

  const html = `
  <div class="gallery">
    <img class="zoomable" src="assets/LSobservatory.jpg" alt="In-game 1" referrerpolicy="no-referrer" loading="lazy">
    <img class="zoomable" src="assets/Griffith_observatory.jpg" alt="real1">
  
  </div>
  <p>Inspirado no Griffith Observatory, Los Angeles.</p>
  <a href="https://pt.wikipedia.org/wiki/Griffith_Observatory" target="_blank" rel="noopener">Wikipédia</a>
  · <a href="https://maps.google.com/?q=Griffith+Observatory" target="_blank" rel="noopener">Google Maps</a>
  · <a href="https://earth.google.com/web/search/Griffith+Observatory" target="_blank" rel="noopener">Google Earth</a>
  · <a href="https://gta.fandom.com/wiki/Los_Santos_Observatory" target="_blank" rel="noopener">GTA Wiki</a>`;

  addPin(4191, 985, "Los Santos Observatory", html);
  enableCoordClick();
};
