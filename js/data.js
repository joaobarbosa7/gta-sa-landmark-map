// HTML do popup a partir dos dados
export function popupHtml(d) {
  const imgs = [...(d.images?.ingame||[]), ...(d.images?.real||[])]
    .map(src => `<img class="zoomable" src="${src}" data-full="${src}" alt="">`)
    .join("");
  const L = d.links || {};
  return `
    <div class="gallery">${imgs}</div>
    <p>${d.desc||""}</p>
    <div class="links">
      ${L.wiki ? `<a href="${L.wiki}" target="_blank" rel="noopener">Wikipédia</a> · ` : ""}
      ${L.gmaps ? `<a href="${L.gmaps}" target="_blank" rel="noopener">Google Maps</a> · ` : ""}
      ${L.earth ? `<a href="${L.earth}" target="_blank" rel="noopener">Google Earth</a> · ` : ""}
      ${L.more  ? `<a href="${L.more}"  target="_blank" rel="noopener">Mais</a>` : ""}
    </div>
  `;
}

// Landmarks
export const landmarks = [
  {
    id: "LSObs",
    title: "Los Santos Observatory",
    category: "Edifícios",
    pin: { x: 4191, y: 985 },
    images: {
      ingame: ["assets/LSObservatory.jpg"],
      real:   ["assets/Griffith_observatory.jpg"]
    },
    links: {
      wiki:  "https://pt.wikipedia.org/wiki/Griffith_Observatory",
      gmaps: "https://maps.google.com/?q=Griffith+Observatory",
      earth: "https://earth.google.com/web/search/Griffith+Observatory",
      more:  "https://gta.fandom.com/wiki/Los_Santos_Observatory"
    },
    desc: "Inspirado no Griffith Observatory, Los Angeles."
  },
  {
    id: "LSTower",
    title: "Los Santos Tower",
    category: "Edifícios",
    pin: { x: 4653, y: 1682 },
    images: {
      ingame: ["assets/LSTower.webp"],
      real:   ["assets/LATower.jpg"]
    },
    links: {
      wiki:  "https://en.wikipedia.org/wiki/U.S._Bank_Tower_(Los_Angeles)",
      gmaps: "https://maps.google.com/?q=U.S.+Bank+Tower+Los+Angeles",
      earth: "https://earth.google.com/web/search/U.S.+Bank+Tower+Los+Angeles",
      more:  "https://gta.fandom.com/wiki/Los_Santos_Tower"
    },
    desc: "Inspirado na U.S.Bank Tower (Los Angeles)."
  }
];
export const areasData = [
  {
    id: "AngelPine",
    title: "Angel Pine",
    group: "Áreas azuis",   // deve existir no teu 'areas' overlay
    style: "azul",          // chave do teu STYLE
    coords: [
      [431, 1053],
      [454,  656],
      [813,  694],
      [809, 1059]
    ],
    popup: "Angel Pine"
    // opcional: bindTo: "LSObs"  // se quiseres que ao clicar abra o popup do pin com este id
  }
];

