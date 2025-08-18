import { useEffect, useState } from "react";
function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <label className="toggle text-base-content border border-base-300 bg-base-200 shadow-sm hover:shadow-md transition-all duration-300">
      {" "}
      <input
        type="checkbox"
        value="synthwave"
        className="theme-controller"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />{" "}
      <svg
        aria-label="sun"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="transition-all duration-300"
      >
        {" "}
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
        >
          {" "}
          <circle cx="12" cy="12" r="4"></circle> <path d="M12 2v2"></path>{" "}
          <path d="M12 20v2"></path> <path d="m4.93 4.93 1.41 1.41"></path>{" "}
          <path d="m17.66 17.66 1.41 1.41"></path> <path d="M2 12h2"></path>{" "}
          <path d="M20 12h2"></path> <path d="m6.34 17.66-1.41 1.41"></path>{" "}
          <path d="m19.07 4.93-1.41 1.41"></path>{" "}
        </g>{" "}
      </svg>{" "}
      <svg
        aria-label="moon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="transition-all duration-300"
      >
        {" "}
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
        >
          {" "}
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>{" "}
        </g>{" "}
      </svg>{" "}
    </label>
  );
}
export default ThemeToggle;
