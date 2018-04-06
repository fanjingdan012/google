import Reflux from 'reflux';
import ReactDOM from 'react-dom';
import React from 'react';

const Actions = Reflux.createActions([
    'show',
    'dismiss',
    'RenderModal'
]);


const CONTAINER = document.createElement('div');
$('body').append(CONTAINER);


Actions.RenderModal.listen(component => ReactDOM.render(component, CONTAINER))

export default Actions;