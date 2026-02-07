import React, { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = React.memo(({ isDark }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particleColor = isDark ? "#ffffff" : "#000000";
  const linkColor = isDark ? "#ffffff" : "#cccccc";
  const backgroundColor = isDark ? "#111418" : "#f7fafc";

  const particleOptions = useMemo(() => ({
    fullScreen: {
      enable: false,
    },
    background: {
      color: {
        value: backgroundColor,
      },
    },
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: particleColor },
      links: {
        enable: true,
        distance: 150,
        color: linkColor,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        out_mode: "out",
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
      },
    },
    detectRetina: true,
  }), [backgroundColor, particleColor, linkColor]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particleOptions}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
});

export default ParticleBackground;