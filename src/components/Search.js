import React from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      foundMovie: ''
    };

    this.handleActorSearch = this.handleActorSearch.bind(this);
    this.handleTitleSearch = this.handleTitleSearch.bind(this);
  }
  handleTitleSearch(e) {
    let title = e.label;
    let found = this.props.moviesArr.find(el => el.Title === title);
    console.log(found);
    this.setState({
      foundMovie: found.Title
    });
  }

  handleActorSearch(opt) {
    let name = opt.label;
    let arr = this.props.moviesArr.filter(el => el.Stars.indexOf(name) !== -1);
    this.setState({
      filtered: arr
    });
  }
    render() {
      let json = this.props.actors;
      let options = json.map(el => {return {value: el.Id.toString(), label: el.Name};});
      let opts = this.props.moviesArr.map(el => {return {value: el.Id.toString(), label: el.Title};});

      return (
        <div className="box">
          <p> Search by movie title: </p>
          <Select
            name="byTitle"
            isClearable
            placeholder="start typing"
            options={opts}
            onChange={(e) => this.handleTitleSearch(e)}  
          />
          <p> {this.state.foundMovie} </p>

          <p> Search by actor: </p>
          <Select
            name="byStar"
            isClearable
            placeholder="start typing"
            options={options}
            onChange={(opt) => this.handleActorSearch(opt)}  
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