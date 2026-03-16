import { createTheme, type MantineColorsTuple } from "@mantine/core";

const primary: MantineColorsTuple = [
  "#edf1f7",
  "#d6dfed",
  "#bccde3",
  "#9fb8d6",
  "#7a9dc4",
  "#6389b0",
  "#506e99",
  "#3f587a",
  "#2f4259",
  "#1e2c3a",
];

export const theme = createTheme({
  colors: {
    primary,
  },
  primaryColor: "primary",
  fontFamily: "var(--font-wix-text), sans-serif",
  headings: {
    fontFamily: "var(--font-wix-display), sans-serif",
  },
});
