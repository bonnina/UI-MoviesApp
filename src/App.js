import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

let j = []; 

class SPA extends React.Component {
  constructor(props) {
    super(props);

    this.newMovie = {
      _id: '', // звідки я його братиму у випадку вводу вручну?
      Title: '',
      Year: '',
      Format: '',
      Stars: []
    };

    this.state = {
      details: this.newMovie,
      movies: [],
      movieTitles: ["Titanic", "Angel A"],
      loading: false
    } 
  }
  
  componentWillMount() {
    window.onload = () => {
      document.querySelector("#default").click();
    };
  }  
    /*
    componentDidMount() {
       fetch('some url')
        .then(response => response.json())
        .then(json => { j = Object.assign([], json); return json.map(movie => movie.Title).sort(); })  
        .then(movieTitles =>
          this.setState({
            movieTitles,
            loading: false,
            movies: j   // так можна?
          })
        )
    } 
    */
    movieDetails(_id) {  
      this.setState({
        details: this.state.movies.find(el => el._id == _id)
      });
    }

     render() {
      return (
        <BrowserRouter>
          <div>
            <Head />
            <Route exact path="/" render={(props) => <MovieList {...props} m={this.state.movieTitles} showDetails={this.movieDetails}/>} />
            <Route exact path="/details" render={(props) => <Details {...props} details={this.state.details}/>} />
            <Route exact path="/add" component={Add} />
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
                <li><Link id="default" to="/" activeClassName="act">My movies</Link></li>
                <li><Link to="/add" activeClassName="act">Add</Link></li>
                <li><Link to="/search" activeClassName="act">Search</Link></li>
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
    /*
    componentWillReceiveProps(nextProps) {
      this.setState(nextProps.details);
    }
    */
    render() {
      /*
      <h2> {this.state.Title} </h2>
      <p className=""> Release year: {this.state.Year} </p>
      <p className=""> Format: {this.state.Format} </p>
      <p className=""> Stars: {this.state.Stars} </p>
      */
      return (
        <div className="box">
          <p> details here soon</p>
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
          (!this.props.m.length) // перевірити щодо (movie._id) і додати в <li> key
          ? <div className="box"><p>No movies yet.. <Link to="/add"> Add movies? </Link></p></div>  
          : <div className="box">
              <ol>
                {this.props.m.sort().map(el => 
                  <li key={el._id}> {el}             
                    <button type="button" className="d" onClick={() => this.props.showDetails(el._id)}><Link to="/details"> Details </Link></button>
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
    }
    render() {
      return (
        <div className="box">
          <p> add a movie </p>
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
