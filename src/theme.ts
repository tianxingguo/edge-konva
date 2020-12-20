const mluviiColors = {
  // theme.palette
  dark: "#181C20",
  darkHover: "#24282C",
  darkGrayBg: "#7f8c99",
  text: "#2E363E",
  midiGray: "#4A525A",

  grayText: "#646E78",
  grayBg: "#A0AAB4",
  line: "#B4BEC8",
  light: "#D6DADE",

  darkBlue: "#18828C",
  blue: "#4AA0AA",
  lightBlue: "#79c5cb",
  chat: "#F0F4F7",

  green: "#8cc643",
  darkGreen: "#6EA028",
  yellow: "#fbd105",
  red: "#FF5A32",
  white: "#FFFFFF",

  pdfRed: "#EF443A",
  docBlue: "#3B82F0",
  xlsGreen: "#009D5B",
  pptYellow: "#F7B52B",
  imgPurple: "#C23D78"
};

const mluviiStyles = {
  radius: "8px"
};

export const mluviiTheme = {
  common: {
    radius: mluviiStyles.radius
  },
  palette: mluviiColors
};

export type MluviiTheme = typeof mluviiTheme;
