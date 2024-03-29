## Map Options

```js
{
  Proxy: {
    url: "/api/dispatch/maps/{s}/{x}/{y}/{z}/{r}/{theme}",
    r: "@2x",
    theme: "dark",
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  CartoDB_DarkMatter: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    ext: "png",
    r: "@2x",
    subdomains: "abcd",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  CartoDB_DarkMatterNoLabels: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    ext: "png",
    r: "@2x",
    subdomains: "abcd",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  CartoDB_Positron: {
    subdomains: "abcd",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    ext: "png",
    r: "@2x",

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  CartoDB_PositronNoLabels: {
    subdomains: "abcd",
    url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    ext: "png",
    r: "@2x",

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  Jawg_Dark: {
    url:
      "https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.{ext}?access-token={token}",
    ext: "png",
    r: "@2x",
    subdomains: "abcd",
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    token: "nMsn...", // https://www.jawg.io/lab/access-tokens
  },
  Jawg_Light: {
    url:
      "https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.{ext}?access-token={token}",
    ext: "png",
    r: "@2x",
    subdomains: "abcd",
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    token: "nMsn...", // https://www.jawg.io/lab/access-tokens
  },
  Mapbox: {
    // accessToken: "pk.eyJ..."
  },
  Stadia_Alidade: {
    url:
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
    ext: "png",
    r: "@2x",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  },
  Stamen_Toner: {
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
    ext: "png",
    r: "@2x",
    subdomains: "abcd",
    attribution:
      'Tiles by <a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Data &copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>',
  },
}
```
