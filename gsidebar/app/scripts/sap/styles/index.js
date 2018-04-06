import SAPTheme from './theme';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

const muiTheme = getMuiTheme(SAPTheme, {});

export default {
    applyTheme(Component) {
        return ThemeDecorator(muiTheme)(Component);
    }
}