import React from "react";
import { Link } from "@reach/router";
import { Map } from "./Map";
import { DataProvider } from "./DataProvider";
import { TweetsForArea } from "./TweetsForArea";
import { Paragraph } from "./Paragraph";
import { Section } from "./Section";
import { ErrorBoundary } from "./ErrorBoundary";

import paragraphStyles from "./paragraph.module.scss";
import { AreaPageHeader } from "./AreaPageHeader";

export const DispatchArea = ({ area }) => {
  const sources = "Data sources";

  return (
    <DataProvider filters={{ area }}>
      <Section styleOption={2}>
        <Paragraph
          content={
            <Link className={paragraphStyles.link} to="/">
              « to main page
            </Link>
          }
        />
      </Section>

      <Section styleOption={1}>
        <AreaPageHeader area={area} />
      </Section>

      <Section styleOption={2} edgeToEdge={true}>
        <ErrorBoundary>
          <Map area={area} />
        </ErrorBoundary>
      </Section>

      <Section styleOption={1}>
        <TweetsForArea />
      </Section>

      <Section styleOption={2}>
        <Paragraph text={sources} />
      </Section>
    </DataProvider>
  );
};
