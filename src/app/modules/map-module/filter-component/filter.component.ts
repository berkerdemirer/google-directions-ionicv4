import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as data from '../../../../assets/data/data.json';
import * as moment from 'moment';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

    locations: any = data;
    filteredLocations: any;
    selectedDate: string;

    @Output() filteredLoc = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    updateSelectedDate($event) {
        this.selectedDate = moment($event.detail.value).format('YYYY-MM-DD');
        this.fetchAvailableLocations();
    }

    isEqualToGivenDate(selectedDate: string, dateCreated: string) {
        return (selectedDate === moment(dateCreated).format('YYYY-MM-DD'));
    }

    fetchAvailableLocations() {
        this.filteredLocations = this.locations.default.filter(location => this.isEqualToGivenDate(this.selectedDate, location.date_created));
        this.sendFilteredLocations();
    }

    sendFilteredLocations() {
        this.filteredLoc.emit(this.filteredLocations);
    }

}
