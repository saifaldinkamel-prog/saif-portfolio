import { StageShell } from "@/components/stage/StageShell";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { IntroGate } from "@/components/transition/Intro";
import { HeroScene } from "@/components/scenes/Hero/HeroScene";
import { AboutScene } from "@/components/scenes/About/AboutScene";
import { WorkPortalScene } from "@/components/scenes/Work/WorkPortalScene";
import { HowIBuildScene } from "@/components/scenes/HowIBuild/HowIBuildScene";
import { ClosingScene } from "@/components/scenes/Closing/ClosingScene";

export default function Home() {
  return (
    <StageShell>
      <IntroGate>
        <FloatingNav />
        <HeroScene />
        <AboutScene />
        <WorkPortalScene />
        <HowIBuildScene />
        <ClosingScene />
      </IntroGate>
    </StageShell>
  );
}
