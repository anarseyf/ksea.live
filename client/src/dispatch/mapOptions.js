
export const mapOptions = (theme, resolution = "@2x") => ({
    url: `/api/dispatch/maps/{s}/{x}/{y}/{z}/{r}/${theme}`,
    r: resolution,
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});