import React from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
// <div className="box"><p> Loading movies... </p></div> 

class MovieList extends React.Component {
    render() {
      let count = 1;
       return (  
        (this.props.loading) 
        ? <div className="box spinner">
          <Loader 
            type="ThreeDots"
            color="#29293d"
            height="90"	
            width="90"
          />  
          </div>
        : (!this.props.moviesArr.length) 
          ? <div className="box"><p>No movies yet.. <Link to="/add"> Add movies? </Link></p></div>  
          : <div className="box">
            <table id="table">
             <tbody>    
              {this.props.moviesArr.map(el => 
                  <tr key={el.Id}> 
                    <td className="count">
                      {count++}
                    </td>
                    <td> 
                      {el.Title} 
                    </td> 
                    <td>        
                      <button type="button" className="d" onClick={() => this.props.showDetails(el)}><Link to="/details"> Details </Link></button>
                    </td>
                    <td>
                      <button type="button" className="d" onClick={() => this.props.del(el)}> Delete </button>
                    </td>
                  </tr>) 
              }
             </tbody>
            </table> 
          </div>
       );
    }
  }

export default MovieList;

/*
              <ol>
                {this.props.moviesArr.map(el => 
                  <li key={el.Id}> {el.Title}             
                    <button type="button" className="d" onClick={() => this.props.showDetails(el)}><Link to="/details"> Details </Link></button>
                    <button type="button" className="d" onClick={() => this.props.del(el)}> Delete </button>
                  </li>)
                }
              </ol>
*/