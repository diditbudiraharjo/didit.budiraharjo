import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function createLenis(): { lenis: Lenis; destroy: () => void } {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy: () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}
