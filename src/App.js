import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

let j = []; 

class SPA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
     render() {
      return (
        <BrowserRouter>
          <div>
            <Head />
            <Route exact path="/" render={(props) => <MovieList {...props} m={this.state.movieTitles}/>} />
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
              <ul>
                {this.props.m.sort().map(el => 
                  <li> {el}             
                    <button type="button" className="d"> Details </button>
                    <button type="button" className="d"> Delete </button>
               </li>)}
              </ul>
            </div>
       );
    }
  }

  class Add extends React.Component {
    render() {
      return (
        <div className="box">
          <p> add a movie </p>
        </div>
      );
    }
  }
  
  class Search extends React.Component {
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
