import React from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(opt) {
    let name = opt.label;
    let arr = this.props.moviesArr.filter(el => el.Stars.indexOf(name) !== -1);
    this.setState({
      filtered: arr
    });
  }
    render() {
      let json = this.props.actors;
      let options = json.map(el => {return {value: el.Id.toString(), label: el.Name};});

      return (
        <div className="box">
          <p> search by name here soon... </p>
          <p> Search by actor:</p>
          <Select
            name="stars"
            isClearable
            placeholder="start typing"
            options={options}
            onChange={(opt) => this.handleInputChange(opt)}  
          />
          {!this.state.filtered.length 
          ? <p></p> 
          : <div>
            <ol>
            {this.state.filtered.map(el => 
                <li key={el.Id}> {el.Title}
                <button type="button" className="d" onClick={() => this.props.showDetails(el)}><Link to="/details"> Details </Link></button> 
                </li>)
            }
            </ol>
          </div>
          }
        </div>
      );
    }
  }

  export default Search;