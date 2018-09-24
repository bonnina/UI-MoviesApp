import React from 'react';
//import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

export default Details;