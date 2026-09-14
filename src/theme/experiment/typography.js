import { tokens } from "./tokens";

export const typography = {
  fontFamily: tokens.typography.fontFamily,

  h1: {
    fontSize: tokens.typography.size["4xl"],
    fontWeight: 700,
    lineHeight: 1.1,
  },

  h2: {
    fontSize: tokens.typography.size["3xl"],
    fontWeight: 600,
    lineHeight: 1.2,
  },

  h3: {
    fontSize: tokens.typography.size["2xl"],
    fontWeight: 600,
    lineHeight: 1.3,
  },

  body1: {
    fontSize: tokens.typography.size.sm,
    lineHeight: 1.5,
  },

  body2: {
    fontSize: tokens.typography.size.sm,
    lineHeight: 1.4,
  },
};
