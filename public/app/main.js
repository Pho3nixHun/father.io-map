import "angular/angular-csp.css!";
import "angular-material/angular-material.css!";

import "jquery";
import "angular";
import "angular-material";
import "angular-messages";
import "angular-animate";
import "api-check";
import "angular-formly";
import "angular-formly-material";

import app from 'app';

angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name], {
        strictDi: false //Some component (ex. mdDialog) fails if true (Cannot be minified)
    });
});