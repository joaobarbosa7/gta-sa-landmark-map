export function setupPins(map) {
  const layer = L.layerGroup().addTo(map);

  const defaultIcon = L.icon({
    iconUrl: "assets/pin.png",
    iconSize: [26, 26],
    iconAnchor: [13, 26],   // base do pino
    popupAnchor: [0, -22]
  });

  function addPin(x, y, title, html="", opts={}) {
  const target = opts.layer || layer;              // <— layer da categoria
  return L.marker([y,x], { icon: opts.icon || defaultIcon })
    .addTo(target)
    .bindPopup(`<h3 class="popup-title">${title}</h3>${html}`, {maxWidth:520});
  }



  function enableCoordClick() {
    map.on("click", e => {
      const x = Math.round(e.latlng.lng), y = Math.round(e.latlng.lat);
      L.popup().setLatLng(e.latlng).setContent(`x:${x}, y:${y}`).openOn(map);
    });
  }

  return { addPin, enableCoordClick, layer };
}
