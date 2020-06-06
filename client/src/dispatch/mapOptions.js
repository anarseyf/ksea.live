export const MapOptions = {
  Localhost: {
    url: "/api/dispatch/maps/{z}/{x}/{y}{r}.{ext}",
    ext: "png",
    r: "@2x",
    attribution: "",
  },
  CartoDB: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    ext: "png",
    r: "@2x",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  JawgDark: {
    url:
      "https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.{ext}?access-token={token}",
    ext: "png",
    r: "@2x",
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    token: "nMsnktvLJ03hHw3Bk4ehaEaNPGKjBE2pLhYTEcMdFEu65cNh4nMfXhGCdEwmhD7H", // https://www.jawg.io/lab/access-tokens
  },
  JawgLight: {
    url:
      "https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.{ext}?access-token={token}",
    ext: "png",
    r: "@2x",
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    token: "nMsnktvLJ03hHw3Bk4ehaEaNPGKjBE2pLhYTEcMdFEu65cNh4nMfXhGCdEwmhD7H", // https://www.jawg.io/lab/access-tokens
  },
  Mapbox: {
    // accessToken: "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2thZXlra3llMGF4MDJ4cXYzY2ZkamVkdyJ9.K8CENC0jz2D0O6ziL_jnNg"
  },
  Stadia: {
    url:
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
    ext: "png",
    r: "@2x",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  },
  Stamen: {
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
    ext: "png",
    r: "@2x",
    attribution:
      'Tiles by <a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Data &copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>',
  },
};

MapOptions.Default = MapOptions.Stamen;
