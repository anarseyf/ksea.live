import React, { useContext } from "react";
import { Paragraph } from "./Paragraph";
import { ThemeContext } from "./ThemeContext";
import classnames from "classnames";
import styles from "./themeswitch.module.scss";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = ["light", "dusk", "dark"];

  const handleClick = (newTheme) => {
    setTheme(newTheme);
  };

  const content = (
    <p>
      {/* The color theme changes based on time of day in Seattle. */}
      Theme:
      {themes.map((t, i) => (
        <span key={t}>
          {" "}
          <button
            className={classnames(styles.button, {
              [styles.selected]: t === theme,
            })}
            onClick={() => handleClick(t)}
          >
            {t}
          </button>
          { (i < (themes.length - 1)) && <span> / </span>}
        </span>
      ))}.
    </p>
  );

  return <Paragraph content={content} />;
};
