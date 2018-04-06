import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import sapColors from './colors';
// import Spacing from '../spacing';

/*
 *  Light Theme is the default theme used in material-ui. It is guaranteed to
 *  have all theme variables needed for every component. Variables not defined
 *  in a custom theme will default to these values.
 */

export default {
  // spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: sapColors.primary,
    primary2Color: Colors.cyan700,
    primary3Color: Colors.grey400,
    accent1Color: sapColors.primary,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: sapColors.text,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: sapColors.border,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.cyan500,
    clockCircleColor: ColorManipulator.fade(Colors.darkBlack, 0.07),
    shadowColor: Colors.fullBlack,
  },
};