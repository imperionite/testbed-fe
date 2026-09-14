import { palette } from "./rawColors";

const createPalette = (mode) => {
  const colors = palette[mode];

  return {
  mode,

  primary: {
    main: colors.foreground,
    contrastText: colors.primaryForeground,
    hover: colors.primaryHover
  },

  secondary: {
    main: colors.secondary,
    contrastText: colors.secondaryForeground,
  },

  // error: {
  //   main: colors.destructive,
  //   contrastText: colors.destructiveForeground,
  // },

  // success: {
  //   main: colors.primary,
  //   contrastText: colors.primaryForeground,
  // },

  background: {
    default: colors.background,
    paper: colors.card,
    accent: colors.backgroundAccent
  },

  text: {
    primary: colors.foreground,
    secondary: colors.mutedForeground,
  },

  divider: colors.border,

  // Semantic/custom colors
  muted: {
    main: colors.muted,
    contrastText: colors.mutedForeground,
  },

  accent: {
    main: colors.accent,
    contrastText: colors.accentForeground,
  },

  card: {
    main: colors.card,
    contrastText: colors.cardForeground,
  },

  popover: {
    main: colors.popover,
    contrastText: colors.popoverForeground,
  },

  input: colors.input,
  ring: colors.ring,

  chart: {
    1: colors.chart1,
    2: colors.chart2,
    3: colors.chart3,
    4: colors.chart4,
    5: colors.chart5,
  },
  };
};

export default createPalette;