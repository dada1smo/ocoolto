export const ScreenSize = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  laptopL: 1440,
  desktop: 2560,
};

export const Device = {
  mobileS: `@media (max-width: ${ScreenSize.mobileS}px)`,
  mobileM: `@media (max-width: ${ScreenSize.mobileM}px)`,
  mobileL: `@media (max-width: ${ScreenSize.mobileL}px)`,
  tablet: `@media (max-width: ${ScreenSize.tablet}px)`,
  laptop: `@media (max-width: ${ScreenSize.laptop}px)`,
  laptopL: `@media (max-width: ${ScreenSize.laptopL}px)`,
  desktop: `@media (max-width: ${ScreenSize.desktop}px)`,
  desktopL: `@media (max-width: ${ScreenSize.desktop}px)`,
};
