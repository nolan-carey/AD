import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { SCENES } from "./tokens";
import { INTER } from "./fonts";
import { Scene1Overwhelm } from "./scenes/Scene1_Overwhelm";
import { Scene2VoiceCustomer } from "./scenes/Scene2_VoiceCustomer";
import { Scene3VoiceQuote } from "./scenes/Scene3_VoiceQuote";
import { Scene4Expense } from "./scenes/Scene4_Expense";
import { Scene5Route } from "./scenes/Scene5_Route";
import { Scene6FollowUpAssistant } from "./scenes/Scene6_FollowUpAssistant";
import { Scene7Lockup } from "./scenes/Scene7_Lockup";

export const KivaAd: React.FC = () => {
  // Touch INTER so font loader runs at composition render time.
  void INTER;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: INTER }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.scene1.duration}>
          <Scene1Overwhelm />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.scene2.duration}>
          <Scene2VoiceCustomer />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.scene3.duration}>
          <Scene3VoiceQuote />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.scene4.duration}>
          <Scene4Expense />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.scene5.duration}>
          <Scene5Route />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.scene6.duration}>
          <Scene6FollowUpAssistant />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.scene7.duration}>
          <Scene7Lockup />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
