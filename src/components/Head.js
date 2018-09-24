import React from 'react';
import { Link } from 'react-router-dom';

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

export default Head;