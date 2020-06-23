import React, { useContext } from "react";
import { Paragraph } from "./Paragraph";
import { ThemeContext } from "./ThemeContext";
import classnames from "classnames";
import styles from "./themeswitch.module.scss";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = ["dark", "light", "dusk"];

  const handleClick = (newTheme) => {
    setTheme(newTheme);
  };

  const content = (
    <p>
      Current: {theme}. Switch to
      {themes.map((t) => (
        <>
          {" "}
          <button
            className={classnames(styles.button, {
              [styles.selected]: t === theme,
            })}
            onClick={() => handleClick(t)}
          >
            {t}
          </button>
        </>
      ))}
    </p>
  );

  return <Paragraph content={content} />;
};
