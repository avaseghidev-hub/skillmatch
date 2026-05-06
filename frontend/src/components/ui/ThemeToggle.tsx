import { useTheme } from "../../features/applications/hooks/useTheme";
import { Button } from "./Button";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="secondary" onClick={toggleTheme}>
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
};