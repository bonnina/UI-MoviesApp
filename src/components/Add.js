import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';


class Add extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        actor: '',
        actorId: ''
      }

      this.handleInputChange = this.handleInputChange.bind(this);
    }
  
    addMovie(e) {
      if (!e.target.checkValidity()) {
        return;
      }
        function sanitize(string) {  // потім підібрати якийсь пекедж
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
      
      let formData = {
        "title": sanitize(e.target.elements.title.value),
        "year": e.target.elements.year.value,
        "format": sanitize(e.target.elements.format.value),
        "stars":  [Number(this.state.actorId)]  // [...Number(this.state.actorId)] не працювало
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
    
    handleInputChange(e) {
      console.log(e);
      this.setState({
        actor: e.label,
        actorId: e.value
      });
      
    }

    render() {
      let json = this.props.actors;
      let options = json.map(el => {return {value: el.Id.toString(), label: el.Name};});
    
      return (
        <div className="box">
          <span>Upload a file</span>
            <label>
              <input type="file" placeholder="please, select a file"/>
            </label>

        <p>or fill in this form</p>

          <form onSubmit={(e) => this.addMovie(e)}>
          <div className="form-group">
            <label htmlFor="Title"> Title </label>
            <input type="text" id="Title" name="title"  required />
          </div>
          <div className="form-group">
            <label htmlFor="Year"> Year </label>
            <input type="number" id="Year" name="year" required />
          </div>
          <div className="form-group">
            <label htmlFor="Format"> Format </label>
            <input type="text" id="Format" name="format" required />
          </div>
          <div className="form-group">
          <CreatableSelect
            name="stars"
            isClearable
            isMulti
            value={this.state.actor}
            options={options}
            onChange={el => this.handleInputChange(el)}  // el => console.log(el.label)
          />
          </div>
          <button className="left"> Submit </button>
        </form>
      </div>
      );
    }
  }

  export default Add;