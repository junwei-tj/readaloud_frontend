import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors
  blue: '#5597cf', // Original "orange colour": #D89216 //Brighter shade of blue: #2186ff  5597cf
  offblack: '#212121', //#121212
  grey: '#5b6066',
  white: '#FFFFFF',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding2: 36,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-regular'},
    }),
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Black'},
    }),
    fontSize: SIZES.h1,
    lineHeight: 36,
  },
  h2: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Bold'},
    }),
    fontSize: SIZES.h2,
    lineHeight: 30,
  },
  h3: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Bold'},
    }),
    fontSize: SIZES.h3,
    lineHeight: 22,
  },
  h4: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Bold'},
    }),
    fontSize: SIZES.h4,
    lineHeight: 22,
  },
  body1: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Regular'},
    }),
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Regular'},
    }),
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Regular'},
    }),
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    ...Platform.select({
      ios: {fontFamily: 'helvetica'},
      android: {fontFamily: 'Roboto-Regular'},
    }),
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
