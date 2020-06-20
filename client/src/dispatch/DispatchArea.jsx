import React from "react";
import { Link } from "@reach/router";
import { Map } from "./Map";
import { DataProvider } from "./DataProvider";
import { TweetsForArea } from "./TweetsForArea";
import { Paragraph } from "./Paragraph";
import { Section } from "./Section";
import { ErrorBoundary } from "./ErrorBoundary";
import { Sources } from "./Sources";
import { AreaPageHeader } from "./AreaPageHeader";
import paragraphStyles from "./paragraph.module.scss";

export const DispatchArea = ({ area }) => {

  return (
    <DataProvider filters={{ area }}>
      <Section styleOption={2}>
        <Paragraph
          content={
            <Link className={paragraphStyles.link} to="/">
              « main page
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
        <Paragraph title="Today's Incidents" />
        <TweetsForArea />
      </Section>

      <Section styleOption={2}>
        <Sources />
      </Section>
    </DataProvider>
  );
};
