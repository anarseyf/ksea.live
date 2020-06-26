export const mapOptions = (theme, phone = false) => {
  const query = phone ? "?phone=true" : "";
  return {
    url: `/api/dispatch/maps/{x}/{y}/{z}/${theme}${query}`,
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps">&copy; jawg maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">openstreetmap</a> contributors',
  };
};
