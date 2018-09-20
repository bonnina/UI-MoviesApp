import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
//import { Creatable } from 'react-select';
//import 'react-select/dist/react-select.css';


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
    
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(json => {
        this.setState({ movies: json, loading: false });
      }) 
      .catch(error => console.log(error.message));
  }

  getActors() {
    fetch('http://localhost:3000/stars')
      .then(response => response.json())
      .then(json => {
        this.setState({actors: json});
        return json;
      }) 
     // .then(json => {console.log(this.state.actors[0].Name);})
      .catch(error => console.log(error.message));
  }

  movieDetails(elem) {  
   // console.log(elem);
    this.setState({
      details: this.state.movies.find(el => el.Id === elem.Id)
    });
  }

  deleteMovie(elem) {
    let film = this.state.movies.find(el => el === elem);
    let id = film.Id;
    let index = this.state.movies.indexOf(elem);
    console.log("index: " + index);
    this.setState({
      loading: true
    });

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let url = `http://localhost:3000/movies/${id}`;

    fetch(url, {
      method: 'DELETE',
      headers: myHeaders
    })
    .then(response => console.log(response.statusText))
    .then(() => {
      this.getMovies();
      this.setState({  // прибрати, коли виправлю масиви в стейті (прибрати масив із заголовками)
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
            <Route exact path="/" render={(props) => <MovieList {...props} moviesArr={this.state.movies} showDetails={this.movieDetails} del={this.deleteMovie}/>} />
            <Route exact path="/details" render={(props) => <Details {...props} details={this.state.details}/>} />
            <Route exact path="/add" render={(props) => <Add {...props} details={this.state.details} getMovies={this.getMovies} actors={this.state.actors}/>} />
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
    
    componentWillReceiveProps(nextProps) {
      if (this.props !== nextProps) {
        this.setState(nextProps.details);
      }
    }
    
    render() {
      let stars = this.props.details.Stars.map(el => el.StarName).join(', ');
      return (
        <div className="box">
          <h2> {this.props.details.Title} </h2>
          <p className=""> Release year: {this.props.details.Year} </p>
          <p className=""> Format: {this.props.details.Format} </p>
          <p className=""> Stars: {stars} </p>
          <button type="button" className="left"><Link to="/"> Back to movies </Link></button>
        </div>
      );
    }
  }

  class MovieList extends React.Component {
    render() {
      // назви фільмів в алфав. порядку
       return ( /* (loading) 
        ? <div className="box">Loading movies...</div> 
        : 
      */ 
          (!this.props.moviesArr.length) 
          ? <div className="box"><p>No movies yet.. <Link to="/add"> Add movies? </Link></p></div>  
          : <div className="box">
              <ol>
                {this.props.moviesArr.map(el => 
                  <li key={el.Id}> {el.Title}             
                    <button type="button" className="d" onClick={() => this.props.showDetails(el)}><Link to="/details"> Details </Link></button>
                    <button type="button" className="d" onClick={() => this.props.del(el)}> Delete </button>
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
      this.state = {
        actor: '',
        actorId: ''
      }

      this.handleInputChange = this.handleInputChange.bind(this);
    }
  
    addMovie(e) {
      if (!e.target.checkValidity()) {
        return;
      }
      
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
        "stars":  [Number(this.state.actorId)]  // [...Number(this.state.actorId)] не працювало
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
    
    handleInputChange(e) {
      console.log(e);
      this.setState({
        actor: e.label,
        actorId: e.value
      });
      
    }

    render() {
      let json = this.props.actors;
      let options = json.map(el => {return {value: el.Id.toString(), label: el.Name};});
    
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
          <CreatableSelect
            name="stars"
            isClearable
            isMulti
            value={this.state.actor}
            options={options}
            onChange={el => this.handleInputChange(el)}  // el => console.log(el.label)
          />
          </div>
          <button className="left"> Submit </button>
        </form>
      </div>
      );
    }
  }

  class Search extends React.Component {
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
