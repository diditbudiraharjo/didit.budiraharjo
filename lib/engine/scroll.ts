type ScrollTriggerStatic = {
  create: (vars: Record<string, unknown>) => { kill: () => void };
};

type Engine = { gsap: typeof import("gsap").gsap; ScrollTrigger: ScrollTriggerStatic };

let loader: Promise<Engine> | null = null;

export function loadGsap(): Promise<Engine> {
  if (!loader) {
    loader = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger: ScrollTrigger as unknown as ScrollTriggerStatic };
      }
    );
  }
  return loader;
}
