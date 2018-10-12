import React from 'react';

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

    handleFile = (file) => {
        let fileReader;
        const handleFileRead = (e) => {
          const content = fileReader.result;
          console.log(content);
          // do something with the content
        };
          fileReader = new FileReader();
          fileReader.onloadend = handleFileRead;
          fileReader.readAsText(file);
      };
  
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