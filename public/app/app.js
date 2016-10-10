'use strict';
/* global angular, navigator */
import PubNub from "pubnub";
import quadkey from 'quadkey';
import CoordMapType from '/app/CoordMapType';

const googleMapsApiKey = "AIzaSyBNg6CzjbTDOU2lWlEIC-aM7th_E1ivhSc";
const app = angular
    .module('father-io-map', [
        'ngMaterial',
        'ngAnimate',
        'formly',
        'formlyMaterial',
        'uiGmapgoogle-maps'
    ])
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: googleMapsApiKey
        });
    })
    .controller('indexCtrl', 
    ['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi){
        $scope.map = {
            center: {
                latitude:47,
                longitude:21
            },
            zoom: 14,
            options: {
                scrollwheel: true
            },
            control: {}
        };
        uiGmapGoogleMapApi.then(function(maps) {
            (function(locationApi){
                if (locationApi) {
                    return locationApi.getCurrentPosition((loc)=>{
                        $scope.map.center = {
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude
                        }
                        $scope.map.control.refresh($scope.map.center);
                        
                        let map = $scope.map.control.getGMap();
                        console.log($scope, quadkey, map);
                        map.overlayMapTypes.insertAt(0, new CoordMapType(new maps.Size(256, 256)));
                    });
                } else {
                    return $scope.location = {error: "Geolocation is not supported by this browser."};
                }
            })(navigator.geolocation);
        });
        $scope.messages = null;
        $scope.time = null;
        $scope.presence = null;
        $scope.status = null;
        $scope.channels = ["area_owner_1202213311101001021","track_1202311303231320","area_1202311303231320","chat_hungary","chat_hungary_hajd-bihar","chat_hungary_hajd-bihar_debrecen"]
        $scope.pubnub = new PubNub({
            subscribeKey: "sub-c-a2f95892-66ee-11e5-9b07-0619f8945a4f",
            publishKey: "pub-c-29070073-5c0c-40f8-b214-a6f5e7bf8e98",
            //secretKey: "secretKey",
            //cipherKey: "myCipherKey",
            //authKey: "myAuthKey",
            logVerbosity: false,
            uuid: "57e7eee8aae5ba0c0922ef9e",
            ssl: false,
            presenceTimeout: 130,
        })
        $scope.pubnub.addListener({
            status: function(statusEvent) {
                if (statusEvent.category === "PNConnectedCategory") {
                    $scope.pubnub.setState(
                        {
                            state: { new: 'state' }
                        },
                        function (status, response) {
                            $scope.status = response;
                            $scope.$apply();
                        }
                    );
                }
                $scope.status = statusEvent;
                $scope.$apply();
            },
            message: function(m) {
                var channelName = m.actualChannel; // Channel Name if from channel group
                var channelGroup = m.subscribedChannel; // Channel Group if from channel group
                var pubTT = m.timetoken; // Publish timetoken
                var msg = m.message; // The Payload
                if (msg.lon && msg.lat) { 
                    $scope.map.center.latitude = msg.lat;
                    $scope.map.center.longitude = msg.lon;
                    //$scope.map.zoom = 19;
                }
                $scope.message = m;
                $scope.$apply();
            },
            presence: function(p) {
                var action = p.action; // Can be join, leave, state-change or timeout
                var channelName = p.actualChannel; // Channel Name if from channel group
                var occupancy = p.occupancy; // No. of users connected with the channel
                var state = p.state; // User State
                var channelGroup = p.subscribedChannel; // Channel Group if from channel group
                var publishTime = p.timestamp; // Publish timetoken
                var timetoken = p.timetoken;  // Current timetoken
                var uuid = p.uuid; // UUIDs of users who are connected with the channel
                $scope.presence = p;
                $scope.$apply();
            }
        })
        $scope.pubnub.time(function(status, response) {
            if (status.error) return status;
            $scope.time = response;
            $scope.pubnub.subscribe({
                channels: $scope.channels,
                withPresence: true // also subscribe to presence instances.
            })
        })
        $scope.showInDebug = function(key){
            return ['time', 'status', 'channels', 'pubnub', 'debug', 'showInDebug'].indexOf(key) == -1;
        }
    }
    ])

export default app;