import React from 'react';
import { Link } from 'react-router-dom';


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

export default MovieList;