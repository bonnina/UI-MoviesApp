import React from 'react';
import { Link } from 'react-router-dom';

class Details extends React.Component {
    
    componentWillReceiveProps(nextProps) {
      if (this.props !== nextProps) {
        this.setState(nextProps.details);
      }
    }
    
    render() {
      let stars = this.props.details.Stars.join(', ');
      return (
        <div className="box">
          <h2> {this.props.details.Title} </h2>
          <p className=""> Release year: <span> {this.props.details.Year} </span></p>
          <p className=""> Format: <span> {this.props.details.Format} </span></p>
          <p className=""> Stars: <span> {stars} </span></p>
          <button type="button" className="left"><Link to="/"> Back to movies </Link></button>
        </div>
      );
    }
  }

export default Details;