import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

class SPA extends React.Component {
  constructor(props) {
    super(props);

    this.newMovie = {
      _id: '', // звідки я його братиму у випадку вводу вручну?
      Title: '',
      Year: '',
      Format: '',
      Stars: '' // поки буде строкою, але потім мабуть треба в масив
    };

    this.state = {
      details: this.newMovie,
      movies: [],
      movieTitles: ["Titanic", "Angel A"], // треба прибрати потім захардкоджене
      loading: false
    } 
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
    /*
    fetch('some url', {
        method: 'GET',
        headers: {
        // що тут писати?
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: //
      })
      .then(response => response.json())
      .then(json => {this.setState({movies: Object.assign([], json)}); return json.map(movie => movie.Title); })  
      .then(titles =>
        this.setState({
          movieTitles: titles,
          loading: false
        })
      )
    */
  }

  movieDetails(_id) {  //  el._id я передавала при створенні списку заголовків фільмів
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
      this.state = props.details // як краще?
    }
    
    handleInputChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    
    addMovie(e) {
      if (!e.target.checkValidity()) {
        // form is invalid, so do nothing
        return;
      }

      const data = new FormData(e.target);
      const actorsArr = form.elements.stars.split(','); // VS каже, що data.get('stars') не можна використати. Замінити. 
      data.set('stars', actorsArr); // але ж на акторів окрема база даних.. чи цей масив допоможе?
   
      fetch('localhost:3000/movies', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: data,
      })
      .then(response => response.json())
      .then(j => console.log(j.movieId));

      // прийде назад movieId, куди його?
      this.props.getMovies(); 
    
    // прийде назад movieId, куди його?

    this.props.getMovies();
    }
    
    render() {
      return (
        <div className="box">
          <form onSubmit={(e) => this.addMovie(e)}>
          <div className="form-group">
            <label htmlFor="Title"> Title </label>
            <input type="text" id="Title" name="Title" value={this.state.Title} onChange={(e) => this.handleInputChange(e)} required />
          </div>
          <div className="form-group">
            <label htmlFor="Year"> Year </label>
            <input type="number" id="Year" name="Year" value={this.state.Year} onChange={(e) => this.handleInputChange(e)} required />
          </div>
          <div className="form-group">
            <label htmlFor="Format"> Format </label>
            <input type="text" id="Format" name="Format" value={this.state.Format} onChange={(e) => this.handleInputChange(e)} required />
          </div>
          <div className="form-group">
            <label htmlFor="Stars"> Actors </label>
            <input type="text" id="Stars" name="Stars" value={this.state.Stars} placeholder="separate with commas" onChange={(e) => this.handleInputChange(e)} required />
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
