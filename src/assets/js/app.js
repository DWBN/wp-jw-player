import Widgets from 'js-widget-hooks';
import './components/widgets';
import domReady from "./util/domReady";

domReady(function () {
    Widgets.init(document.querySelector('body'), {
        widgetClass: 'js-dwbn-jw-widget' // in order to avoid conflicts with other plugins, we use a dedicated namespace here
    });
});