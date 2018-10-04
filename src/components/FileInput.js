import React from 'react';
// https://www.papaparse.com/docs#strings
// greatly inspired by http://www.ilonacodes.com

export default class FileInput extends React.Component {
  constructor(props) {
     super(props);

    this.handleFile = this.handleFile.bind(this);
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
}
