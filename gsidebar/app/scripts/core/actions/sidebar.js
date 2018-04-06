import Reflux from 'reflux'
export default Reflux.createActions([

    'SidebarSetActive', /// when extension needs sidebar
    'SidebarToggle',
    'SidebarSetView',
    'SidebarBlur',
    'ShowPrevious',
    'ShowLoading'
]);