'use strict';

const app = angular    
    .module('ngMojo', [
        'ngMaterial',
        'ngAnimate',
        'formly',
        'formlyMaterial',
    ])
    .controller('indexCtrl', function($scope){
        $scope.title = "IT WORKS!"
    })

export default app;


