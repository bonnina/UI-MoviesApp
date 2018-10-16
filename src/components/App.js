import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Head from './Head';
import MovieList from './MovieList';
import Details from './Details';
import Add from './Add';
import Search from './Search';
import BACKEND_URL from './backendURL';

class SPA extends React.Component {
  constructor(props) {
    super(props);

    this.newMovie = {
      id: '', 
      Title: '',
      Year: '',
      Format: '',
      Stars: '' 
    };

    this.state = {
      details: this.newMovie,
      movies: [],
      actors: [],
      loading: false
    } 

    this.getMovies = this.getMovies.bind(this);
    this.getActors = this.getActors.bind(this);
    this.movieDetails = this.movieDetails.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
  }
  
  componentWillMount() {
    window.onload = () => {
      document.querySelector('#home').click();
    };
  }  
  componentDidMount() {
    this.getMovies();
    this.getActors();
  } 
  
  getMovies() {
    this.setState({ 
      loading: true 
    });
    
    fetch(`${BACKEND_URL}/movies`)
      .then(response => response.json())
      .then(json => {
        let getStars = function (movie) {
          return new Promise((resolve, reject) => {
            let getActor = function(actor) {
              return new Promise((resolve, reject) => {
                 if(actor.StarName) {
                   actor = actor.StarName;
                 }
                 resolve(actor);
              });
            }
            let prev = movie.Stars.map(getActor);
            Promise.all(prev)
            .then(data => {
              movie.Stars = data;
            });
            resolve(movie);
            });
          }
        
        let actions = json.map(getStars);
        Promise.all(actions)
          .then(data => this.setState({ movies: data, loading: false }));
      }) 
      .catch(error => console.log(error.message));
  }

  getActors() {
    fetch(`${BACKEND_URL}/stars`)
      .then(response => response.json())
      .then(json => {
        this.setState({actors: json});
        return json;
      }) 
      .catch(error => console.log(error.message));
  }

  movieDetails(elem) {  
    this.setState({
      details: this.state.movies.find(el => el.Id === elem.Id)
    });
  }

  deleteMovie(elem) {
    let film = this.state.movies.find(el => el === elem);
    let id = film.Id;
    let index = this.state.movies.indexOf(elem);
    this.setState({
      loading: true
    });

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let url = `${BACKEND_URL}/movies/${id}`;

    fetch(url, {
      method: 'DELETE',
      headers: myHeaders
    })
    .then(response => console.log(response.statusText))
    .then(() => {
      this.getMovies();
      this.setState({  
        loading: false,
        movies: [...this.state.movies.slice(0, index), ...this.state.movies.slice(index + 1)]
      });
    })
    .catch(error => console.log(error.message));
  }

     render() {
       return (
        <BrowserRouter>
          <div>
            <Head />
            <Route exact path="/" render={(props) => <MovieList {...props} moviesArr={this.state.movies} showDetails={this.movieDetails} del={this.deleteMovie} loading={this.state.loading}/>} />
            <Route exact path="/details" render={(props) => <Details {...props} details={this.state.details}/>} />
            <Route exact path="/add" render={(props) => <Add {...props} details={this.state.details} getMovies={this.getMovies} actors={this.state.actors}/>} />
            <Route exact path="/search" render={(props) => <Search {...props} actors={this.state.actors} moviesArr={this.state.movies} showDetails={this.movieDetails}/>} />
            </div>
        </BrowserRouter>
      );
    }
}


export default SPA;
