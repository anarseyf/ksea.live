import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { Header } from "./Header";
import { TweetsForArea } from "./TweetsForArea";
import { Rehoboam } from "./Rehoboam";
import { LegendSection } from "./Legend";
import { Histogram } from "./Histogram";
import { Paragraph } from "./Paragraph";
import { Section } from "./Section";

export const DispatchArea = ({ area }) => {
  const sources = "Data sources";

  return (
    <TweetsProvider filters={{ area }}>
      <Section styleOption={1}>
        <Rehoboam area={area} />
        <Header area={area} />
        <Histogram />
      </Section>

      <Section styleOption={2} edgeToEdge={true}>
        <Map area={area} />
        <LegendSection />
      </Section>

      <Section styleOption={1}>
        <TweetsForArea />
      </Section>

      <Section styleOption={2}>
        <Paragraph text={sources} />
      </Section>
    </TweetsProvider>
  );
}
