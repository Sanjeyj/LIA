import { useTheme } from "../../contexts/ThemeContext";

export function SceneLighting() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Soft Ambient Fill */}
      <ambientLight intensity={isDark ? 0.35 : 0.7} color={isDark ? "#07111F" : "#F8FAFC"} />

      {/* Main Directional Key Light */}
      <directionalLight
        position={[6, 8, 6]}
        intensity={isDark ? 0.9 : 1.8}
        color={isDark ? "#D7B65A" : "#FFFFFF"}
        castShadow={false}
      />

      {/* Signature LIA Gold Specular Rim Light */}
      <directionalLight
        position={[-6, 4, -5]}
        intensity={isDark ? 2.8 : 2.2}
        color="#D7B65A"
      />

      {/* Deep Navy Atmosphere Fill Light */}
      <pointLight
        position={[0, -6, 4]}
        intensity={isDark ? 2.5 : 1.4}
        color="#174EA6"
        distance={15}
      />
    </>
  );
}
