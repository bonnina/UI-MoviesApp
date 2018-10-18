import React from 'react';
import BACKEND_URL from './backendURL';

export default class DropzoneErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null
      };
      this.handleFile = this.handleFile.bind(this);
    }
  
    componentDidCatch(error, info) {
      this.setState({
        error: error
      });
      console.log(info.componentStack);
    }
    /*
    handleFile = (file) => {
        let fileReader;
        const handleFileRead = (e) => {
          const content = fileReader.result;
          console.log(content);
          // do something
        };
          fileReader = new FileReader();
          fileReader.onloadend = handleFileRead;
          fileReader.readAsText(file);
      };
      */
      handleFile = (files) => {
      let file = files[0];
      
      if (file) {
        let data = new FormData();
        data.append('file', file);
        
        fetch(`${BACKEND_URL}/upload`, {
          method: 'POST',
          body: data
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.log(error.message));
      }
    }
    
    render() {
      if (this.state.error) {
        return (
          <div>
            <input type='file'
            id='file'
            accept='.txt'
            onChange={e => this.handleFile(e.target.files[0])}
            />
          </div>
        );
      }
      return this.props.children;
    }
  }