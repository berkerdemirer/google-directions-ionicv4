import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController} from '@ionic/angular';

declare var google;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    filteredLocations: any;


    directionMarkers = [];
    markers = [];

    i = 0;
    clickCount = 0;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

    distanceBetweenTwoPoints: number;
    isCalculateButtonActive: boolean;

    constructor(public alertController: AlertController) {
    }

    ngOnInit() {
        this.loadMap();
    }

    receiveFilteredLocations($event) {
        this.filteredLocations = $event;
        if (this.filteredLocations.length <= 0) {
            this.presentNoLocationAlert();
        }
        this.addMarker();
    }

    loadMap() {

        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 7,
            center: {lat: 58, lng: 26},
            disableDefaultUI: true,

        });
    }

    startNavigating() {

        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay.setMap(this.map);
        }

        this.directionsService.route({
            origin: this.directionMarkers[0].position,
            destination: this.directionMarkers[1].position,
            travelMode: google.maps.TravelMode.DRIVING
        }, (res, status) => {

            if (status === google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(res);
                this.distanceBetweenTwoPoints = this.directionsDisplay.directions.routes[0].legs[0].distance.text;
            } else {
                this.presentNoRouteAlert();
            }

        });

    }

    addMarker() {

        this.filteredLocations.map(location => {
            const myLatLng = {lat: location.lat, lng: location.lng};
            const marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: myLatLng,
                icon: 'https://www.google.com/mapfiles/marker.png'
            });
            this.markers.push(marker);

            marker.addListener('click', () => {

                this.clickCount++;
                this.directionMarkers[this.i] = marker;

                if (this.clickCount <= 2) {
                    marker.setIcon('https://maps.google.com/intl/en_us/mapfiles/ms/micons/purple.png');
                } else if (this.clickCount === 3) {
                    this.markers.map(m => {
                        m.setIcon('https://www.google.com/mapfiles/marker.png');
                    });
                    marker.setIcon('https://maps.google.com/intl/en_us/mapfiles/ms/micons/purple.png');
                    this.clickCount = 1;
                }

                if (this.directionMarkers.length === 2 && (this.directionMarkers[0] !== this.directionMarkers[1])) {
                    this.isCalculateButtonActive = true;
                } else {
                    if (this.i >= 1) {
                        this.presentNoRouteAlert();
                        this.directionMarkers = [];
                        this.i = 0;
                    } else {
                        this.i++;
                        this.isCalculateButtonActive = false;
                    }
                }
            });
        });

    }

    calculateDistance() {
        this.startNavigating();
        this.i = 0;
        this.directionMarkers = [];
    }

    async presentNoLocationAlert() {
        const alert = await this.alertController.create({
            header: 'Oops!',
            message: 'We couldnt find locations for given date',
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentNoRouteAlert() {
        const alert = await this.alertController.create({
            header: 'Oops!',
            message: 'We couldnt find any route between these locations',
            buttons: ['OK']
        });

        await alert.present();
    }


}

