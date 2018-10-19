import React from 'react';
import Dropzone from 'react-dropzone';
import DropzoneErrorBoundary from './DropzoneErrorBoundary';
import BACKEND_URL from './backendURL';

export default class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem: false
    }
  }
  
    onDrop = (files) => {
      let file = files[0];
      
      if (file) {
        let data = new FormData();
        data.append('file', file);

        fetch(`${BACKEND_URL}/upload`, {
          method: 'POST',
          body: data
        })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch(error => {
          console.log(error.message);
          this.setState({  
            problem: true
          });
        });
       // this.props.getMovies();  - doesn't work
      }
    }
  
  render() {
    const s = {
      width: '31vw', 
      height: '25vw',
      borderWidth: '2px',
      borderColor: '#33334d',
      borderStyle: 'dashed',
      borderRadius: '5px',
      marginLeft: '5vw'
    };
    return (
    (this.state.problem)
    ? <div className="box spinner">
        <p id="problem"> Ran into a problem.. Please reload the page</p>
      </div>
    :
    <div>
    <p id="forFile"> Or upload a file </p>
    <DropzoneErrorBoundary>
      <Dropzone
        id="dropzone"
        name="movies"
        style={s}
        onDrop={this.onDrop}
        accept='.txt'
      > 
      </Dropzone>
    </DropzoneErrorBoundary>
    </div>
    );
  }
}
