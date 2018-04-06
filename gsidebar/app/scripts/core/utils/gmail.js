


const getCurrentView = () => {
    if ($('div.Cq.RdSZF').length > 0 || $('div.A1.D.E').length > 0 || $('div[gh=tl]').length > 0) {
        return 'list';
    } else if ($('.nH.qZ.G-atb').length > 0) {
        return 'settings';
    } else if ($('table.Bs.nH.iY').length > 0) {
        return 'conversation';
    } else if ($('div.fN').length > 0) {
        return 'compose';
    } else {
        return null;
    }
}


export { getCurrentView };