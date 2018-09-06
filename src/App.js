import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

class SPA extends React.Component {
  constructor(props) {
    super(props);

    this.newMovie = {
      id: '', 
      Title: '',
      Year: '',
      Format: '',
      Stars: '' // поки буде строкою, потім в масив
    };

    this.state = {
      details: this.newMovie,
      movies: [],
      movieTitles: [], 
      loading: false
    } 

    this.getMovies = this.getMovies.bind(this);
    this.movieDetails = this.movieDetails.bind(this);
  }
  
  componentWillMount() {
    window.onload = () => {
      document.querySelector("#default").click();
    };
  }  
    
  componentDidMount() {
    this.getMovies()
  } 
  
  getMovies() {
    this.setState({ 
      loading: true 
    });
    /*
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    function handleErrors(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
    }
    */

    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(json => {
        this.setState({ movies: json, loading: false }); 
        console.log(this.state.movies[0]);
        return json.map(el => el.Title); })  
      .then(titles => this.setState({ movieTitles: titles }))
      .catch(error => console.log(error.message));
      
  }

  movieDetails(elemId) {  //  elemId я передавала при створенні списку заголовків фільмів
    this.setState({
      details: this.state.movies.find(el => el.id === elemId)
    });
  }

     render() {
      return (
        <BrowserRouter>
          <div>
            <Head />
            <Route exact path="/" render={(props) => <MovieList {...props} m={this.state.movieTitles} showDetails={this.movieDetails}/>} />
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
                <li><Link id="default" to="/"> My movies </Link></li>
                <li><Link to="/add"> Add </Link></li>
                <li><Link to="/search"> Search </Link></li>
              </ul>
            </nav>
          </header>
          {this.props.children} 
        </div>
      );
    }
  }

  class Details extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.details
    }
    // зробити щоб оновлювалось
    componentWillReceiveProps(nextProps) {
      this.setState(nextProps.details);
    }
    
    render() {
      return (
        <div className="box">
          <h2> {this.state.Title} </h2>
          <p className=""> Release year: {this.state.Year} </p>
          <p className=""> Format: {this.state.Format} </p>
          <p className=""> Stars: details here soon.. </p>
          <button type="button"><Link to="/"> Back to movies </Link></button>
        </div>
      );
    }
  }

  class MovieList extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      // назви фільмів в алфавітному порядку
       return ( /* (loading) 
        ? <div className="box">Loading movies...</div> 
        : 
      */ 
     
          (!this.props.m.length) 
          ? <div className="box"><p>No movies yet.. <Link to="/add"> Add movies? </Link></p></div>  
          : <div className="box">
              <ol>
                {this.props.m.sort().map(el => 
                  <li key={el.Id}> {el}             
                    <button type="button" className="d" onClick={() => this.props.showDetails(el.Id)}><Link to="/details"> Details </Link></button>
                    <button type="button" className="d"> Delete </button>
               </li>)}
              </ol>
            </div>
       );
    }
  }

  class Add extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.details // як краще?
    }
    /*
    handleInputChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    */
    addMovie(e) {
      if (!e.target.checkValidity()) {
        return;
      }
    
      // const data = new FormData(e.target);
      // const actorsArr = e.target.elements.stars.value.split(','); 
      // data.set('stars', actorsArr); 
      console.log({
        "title": e.target.elements.title.value,
        "year": e.target.elements.year.value,
        "format": e.target.elements.format.value,
        "stars":  [...e.target.elements.stars.value]
       });
      
      fetch('localhost:3000/movies', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
           "title": e.target.elements.title.value,
           "year": e.target.elements.year.value,
           "format": e.target.elements.format.value,
           "stars":  [...e.target.elements.stars.value]
          })
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
    // value={this.state.Title} onChange={(e) => this.handleInputChange(e)}
    render() {
      return (
        <div className="box">
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
          <p> search by name </p>
          <p> search by actor </p>
        </div>
      );
    }
  }


export default SPA;
