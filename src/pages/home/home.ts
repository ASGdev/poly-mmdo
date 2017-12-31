import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DetailsPage } from "../details/details";
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { TMDB_API_KEY } from '../../app/tmdb';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Shake } from '@ionic-native/shake';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
 
export interface Movie {
  title: string;
  author: string;
  id: number;
  release_date: string;
  overview: string;
  img_url: string;
  backdrop_path: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController, private http: HttpClient, private alertCtrl: AlertController, private shake: Shake, private platform: Platform) {

  }

  ionViewDidEnter(): void {
    this.platform.ready().then(() => {
      
        const watch = this.shake.startWatch().subscribe(() => {
          
          let movies_list:Movie[];
          this.discoverMovies().subscribe(
            (data) => {
              movies_list = data;
              this.showRandomMovieAlert(data);
            },
            error => {
              let alert = this.alertCtrl.create({
                title: "Erreur !",
                message: error,
                buttons: ["Ok"]
              });
              alert.present();
            }
          );
    
        
        });
      });
    }

  /*------------*/

  search_results:Observable<Movie[]>;

  showDetails(item){
    console.log("showing details of ");
    console.log(item);
  }

  search_input = null;

  onSearchInput(){
    console.log("Search input is : " + this.search_input);
    this.is_search_text = true;
    if(this.search_input == ""){
      this.is_search_text = false;
    } else {
      this.search_results = this.fetchResults(this.search_input);
    }
  }

  is_search_text = false;
  
  detailsPage = DetailsPage;

  fetchResults(query : string) : Observable<Movie[]> {
    
    // get movie data
    const params = new HttpParams().set('api_key', TMDB_API_KEY).set('language', "fr-FR").set('query', query);

    return this.http.get<Movie[]>("https://api.themoviedb.org/3/search/movie", {params}).pluck("results").map(result => { 
      const items = <Movie[]>result; 
      items.forEach(item => {
        item.img_url = "https://image.tmdb.org/t/p/w500/" + item.backdrop_path;
      });
      return items;
    });
  }

  private discoverMovies(): Observable<Movie[]>{
    const params = new HttpParams().set('api_key', TMDB_API_KEY).set('language', "fr-FR").set('primary_release_year', "2017");

    return this.http.get<Movie[]>("https://api.themoviedb.org/3/discover/movie", {params}).pluck("results").map(result => { 
      const items = <Movie[]>result; 
      items.forEach(item => {
        item.img_url = "https://image.tmdb.org/t/p/w500/" + item.backdrop_path;
      });
      return items;
    });
    
  }

  private showRandomMovieAlert(movies: Movie[]) : void{
    // choose movie
    var item = movies[Math.floor(Math.random() * movies.length)];
   

    // show user
    let alert = this.alertCtrl.create({
      title: item.title,
      message: item.overview,
      buttons: ["Annuler",
        {
          text: 'Détails',
          handler: () => {
            this.navCtrl.push(DetailsPage, { movie: item })
          }
        }
      ]
    });
    alert.present();
  }

}


