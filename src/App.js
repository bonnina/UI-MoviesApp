import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class SPA extends React.Component {
  constructor(props) {
    super(props);

    this.newMovie = {
      id: '', 
      Title: '',
      Year: '',
      Format: '',
      Stars: '' // поки строкою, потім в масив
    };

    this.state = {
      details: this.newMovie,
      movies: [],
      movieTitles: [], 
      loading: false
    } 

    this.getMovies = this.getMovies.bind(this);
    this.movieDetails = this.movieDetails.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
  }
  
  componentWillMount() {
    window.onload = () => {
      document.querySelector('#home').click();
    };
  }  
  componentDidMount() {
    this.getMovies()
  } 
  
  getMovies() {
    this.setState({ 
      loading: true 
    });
    
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(json => {
        this.setState({ movies: json, loading: false }); 
       // потім прибр.
        return json.map(el => el.Title); })  
      .then(titles => this.setState({ movieTitles: titles }))
      .catch(error => console.log(error.message));
      
  }

  movieDetails(elemId) {  
    this.setState({
      details: this.state.movies.find(el => el.id === elemId)
    });
  }

  deleteMovie(id) {
    this.setState({loading: true});

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let url = `http://localhost:3000/movies/${id}`;
// поки не працює, id не передається з мувіліст
    fetch('http://localhost:3000/movies/7', {
      method: 'DELETE',
      headers: myHeaders
    })
    .then(response => console.log(response.statusText))  // тимч.
    .catch(error => console.log(error.message));

    this.getMovies();
  }

     render() {
      return (
        <BrowserRouter>
          <div>
            <Head />
            <Route exact path="/" render={(props) => <MovieList {...props} moviesArr={this.state.movies} m={this.state.movieTitles} showDetails={this.movieDetails} del={this.deleteMovie}/>} />
            <Route exact path="/details" render={(props) => <Details {...props} details={this.state.details}/>} />
            <Route exact path="/add" render={(props) => <Add {...props} details={this.state.details} getMovies={this.getMovies}/>} />
            <Route exact path="/search" component={Search} />
          </div>
        </BrowserRouter>
      );
     }
  }

  class Head extends React.Component {
    render() {
      return (
        <div>
          <header>
            <h1>
              MooWiz
            </h1>
            <nav>
              <ul>
                <li><Link id="home" to="/"> My movies </Link></li>
                <li><Link to="/add"> Add </Link></li>
                <li><Link to="/search"> Search </Link></li>
              </ul>
            </nav>
          </header>
        </div>
      );
    }
  }

  class Details extends React.Component {
    constructor(props) {
      super(props);
    }
    
    componentWillReceiveProps(nextProps) {
      this.setState(nextProps.details);
    }
    
    render() {
      return (
        <div className="box">
          <h2> {this.props.details.Title} </h2>
          <p className=""> Release year: {this.props.details.Year} </p>
          <p className=""> Format: {this.props.details.Format} </p>
          <p className=""> Stars: details here soon.. </p>
          <button type="button"><Link to="/"> Back to movies </Link></button>
        </div>
      );
    }
  }

  class MovieList extends React.Component {
    constructor(props) {
      super(props);
      this.filter = this.filter.bind(this);
    }

  filter(i) {
    let film = this.props.moviesArr.find(el => el.Title === i);
    return film.Id;
  }

    render() {
      // назви фільмів в алфав. порядку
       return ( /* (loading) 
        ? <div className="box">Loading movies...</div> 
        : 
      */ 
          (!this.props.m.length) 
          ? <div className="box"><p>No movies yet.. <Link to="/add"> Add movies? </Link></p></div>  
          : <div className="box">
              <ol>
                {this.props.m.map(el => 
                  <li key={this.filter(el)}> {el}             
                    <button type="button" className="d" onClick={() => this.props.showDetails(el.Id)}><Link to="/details"> Details </Link></button>
                    <button type="button" className="d" onClick={() => this.props.del(el.Id)}> Delete </button>
                  </li>)
                }
              </ol>
            </div>
       );
    }
  }

  class Add extends React.Component {
    constructor(props) {
      super(props);
    }

    addMovie(e) {
      if (!e.target.checkValidity()) {
        return;
      }
    
      // const data = new FormData(e.target);
      // const actorsArr = e.target.elements.stars.value.split(','); 
      // data.set('stars', actorsArr); 
      
        function sanitize(string) {  // потім підібрати якийсь пекедж
          const map = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#x27;',
              "/": '&#x2F;',
          };
          const reg = /[&<>"'/]/ig;
          return string.replace(reg, (match)=>(map[match]));
        }
      let formData = {
        "title": sanitize(e.target.elements.title.value),
        "year": e.target.elements.year.value,
        "format": sanitize(e.target.elements.format.value),
        "stars":  [...Number(e.target.elements.stars.value)]  // поки цифра, потім буде співвідноситись з актором у списку
       };

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(j => console.log(j.movieId))
      .catch(error => {
        if (error.response) {
          console.log('Code: ' + error.response.data.error.code + 
                '\r\nMessage: ' + error.response.data.error.message);
        } else {
          console.log('Failed to add movie');
        }
      });  

     this.props.getMovies(); 
      
    }
    // файл потім, спочатку дороблю деліт
    render() {
      return (
        <div className="box">
          <span>Upload a file</span>
            <label>
              <input type="file" placeholder="please, select a file"/>
            </label>

        <p>or fill in this form</p>

          <form onSubmit={(e) => this.addMovie(e)}>
          <div className="form-group">
            <label htmlFor="Title"> Title </label>
            <input type="text" id="Title" name="title"  required />
          </div>
          <div className="form-group">
            <label htmlFor="Year"> Year </label>
            <input type="number" id="Year" name="year" required />
          </div>
          <div className="form-group">
            <label htmlFor="Format"> Format </label>
            <input type="text" id="Format" name="format" required />
          </div>
          <div className="form-group">
            <label htmlFor="Stars"> Actors </label>
            <input type="number" id="Stars" name="stars" placeholder="separate with commas" required />
          </div>
          <button> Submit </button>
        </form>
      </div>
      );
    }
  }

  class Search extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="box">
          <p> search by name here soon... </p>
          <p> search by actor here soon...  </p>
        </div>
      );
    }
  }


export default SPA;
