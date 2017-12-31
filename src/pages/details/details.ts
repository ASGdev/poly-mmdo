import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Movie } from '../home/home';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  movie: Movie;

  constructor(public navParams: NavParams) {
    this.movie = this.navParams.get('movie');
  }

}
