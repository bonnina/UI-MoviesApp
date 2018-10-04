import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import FileInput from './FileInput';


export default class Add extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        actorIds: []
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.sanitize = this.sanitize.bind(this);
    }
    sanitize(string) {  
      const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          "/": '&#x2F;',
      };
      const reg = /[&<>"'/]/ig;
      return string.replace(reg, (match)=>(map[match]));
    }

    addMovie(e) {
      if (!e.target.checkValidity()) {
        return;
      }
       
      let formData = {
        "title": this.sanitize(e.target.elements.title.value),
        "year": e.target.elements.year.value,
        "format": this.sanitize(e.target.elements.format.value),
        "stars":  this.state.actorIds  // [...Number(this.state.actorId)] 
       };

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(j => console.log(j.movieId))
      .catch(error => {
        if (error.response) {
          console.log('Code: ' + error.response.data.error.code + 
                '\r\nMessage: ' + error.response.data.error.message);
        } else {
          console.log('Failed to add movie');
        }
      });  

     this.props.getMovies(); 
    }
    
    handleInputChange(opt, meta) {
      switch(meta.action) {
        case 'clear':
        this.setState({
          actorIds: []
        });
        break;

        case 'select-option':
        this.setState({
          actorIds: [...this.state.actorIds, opt[opt.length -1].value]
        });
        break;

        case 'create-option':
        let formData = {
          "name": this.sanitize(opt[opt.length -1].label),
        };
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        fetch('http://localhost:3000/stars', {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(json => {
          this.setState({
            actorIds: [...this.state.actorIds, json.Id]
          });
        })
        .catch(error => console.log(error.message));
        break;
        
        case 'remove-value':
        let arr = opt.map(el => el.value);
        this.setState({
          actorIds: arr
        });
        break;
        
        default: 
        return;
      }
    }

    render() {
      let json = this.props.actors;
      let options = json.map(el => {return {value: el.Id.toString(), label: el.Name};});
    
      return (
      <div id="parent-box">
        <div className="child-box">
        <p> Fill in this form </p>
          <form onSubmit={(e) => this.addMovie(e)}>
          <div className="form-group">
            <label htmlFor="Title"> Title </label>
            <input type="text" className="inp" id="Title" name="title"  required />
          </div>
          <div className="form-group">
            <label htmlFor="Year"> Year </label>
            <input type="number" className="inp" id="Year" name="year" required />
          </div>
          <div className="form-group">
            <label htmlFor="Format"> Format </label>
            <input type="text" className="inp" id="Format" name="format" required />
          </div>
          <div className="form-group">
            <label htmlFor="CS"> Actors </label>
            <CreatableSelect
              id="CS"
              name="stars"
              isClearable
              isMulti
              placeholder="start typing"
              options={options}
              onChange={(opt, meta) => this.handleInputChange(opt, meta)} 
            />
          </div>
          <button className="left"> Submit </button>
        </form>
        </div>
        
        <div className="child-box">
          <p id="forFile"> Or upload a file </p>
             <FileInput stars={this.props.actors}/>
        </div>
      </div>
      );
    }
  }

