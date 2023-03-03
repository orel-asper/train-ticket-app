import { Colors } from "../interfaces/global";

export const minimapStyle = {
    height: 100,
    border: "1px solid #a9a9a9",
    borderRadius: 4,
};

export const colors: Colors = {
    javascript: "#f0db4f",
    typescript: "#007acc",
    python: "#3572A5",
    java: "#b07219",
    csharp: "#178600",
    ruby: "#CC342D",
    go: "#00ADD8",
    php: "#4F5D95",
    scala: "#DC322F",
    kotlin: "#A97BFF",
    swift: "#FFAC45",
    rust: "#DEA584",
    default: "#000000"
};

export const nodeWidth = 180;
export const nodeHeight = window.innerHeight / 8;

export const GRAY = "#d3d3d3";
export const LIGHT_GRAY = "#f5f5f5";
export const DARK_GRAY = "#a9a9a9";
export const BLACK = "#000000";
export const WHITE = "#ffffff";
export const RED = "#ff0000";

export const filterArray = ['All', 'Sink', 'Vulnerabilities', 'Public Exposed & Sink'];