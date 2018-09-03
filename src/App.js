import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';


let j = [];

class SPA extends React.Component {
   componentWillMount() {
      window.onload = () => {
       document.querySelector("#default").click();
      };
    }  
     render() {
      return (
        <BrowserRouter>
          <div>
            <Head />
            <Route exact path="/" component={MovieList} />
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
      // переписати з доп. рідаксу
      this.state = {
        movies: [],
        movieTitles: [],
        loading: false
      } 
    }
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
    render() {
      // назви фільмів в алфавітному порядку
       return ( /* (loading) 
        ? <div className="box">Loading movies...</div> 
        : 
      */
          (!this.state.movieTitles.length) 
          ? <div className="box"><p>No movies yet.. <Link to="/add">Add movies?</Link></p></div>  
          : <div className="box">
              <ul>
                {this.state.movieTitles.map((a,b) => 
                  <li key={a}> {b}             
                    <button type="button" className="del" > Delete </button>
                    <button type="button" className="details"> Details </button>
               </li>)}
              </ul>
            </div>
       );
      /*
      // фільми таблицею
      let movies = this.state.movies.map((film, key) => {
         return (
          <tr key={key}>
            <td>{film.Title}</td>
            <td>{film.ReleaseYear}</td>
            <td>{film.Format}</td>
            <td>{film.Stars}</td>
            <td>
              <button 
                type="button" 
                className="del"
                onClick={this.deleteMovie.bind(this, film.id)}>
                  Delete
              </button>
            </td>
          </tr>
        )
      })
      return (
        !movies.length
          ? <div className="box">
              <p>No movies yet.. <Link to="/add"> Add movies?</Link></p>     
            </div>
          : <div className="box">
           <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Format</th>
                  <th>Stars</th>
                </tr>
              </thead>
              <tbody>
                {movies}
              </tbody>
            </table>
          </div>
       );
       */
    }
  /*  deleteMovie (id) {
      store.dispatch({
        type: 'DELETE_MOVIE',
        id
      })
    } */
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
