/* global angular */
import "angular/angular-csp.css!";
import "angular-material/angular-material.css!";

import _ from 'lodash'
import $ from 'jquery'

import "angular";
import "angular-material";
import "angular-messages";
import "angular-animate";
import "api-check";
import "angular-formly";
import "angular-formly-material";

import "angular-simple-logger";
import "angular-google-maps";

import app from 'app';

angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name], {
        strictDi: false //Some component (ex. mdDialog) fails if true (Cannot be minified)
    });
});