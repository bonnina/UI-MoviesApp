import React from 'react';
import ReactDropzone from "react-dropzone";
// https://www.papaparse.com/docs#strings
// greatly inspired by http://www.ilonacodes.com

export default class FileInput extends React.Component {
    onDrop = (files) => {
        let fileReader;
        const handleFileRead = (e) => {
          const content = fileReader.result;
          console.log(content);
          // do something with the content
        };
  
          fileReader = new FileReader();
          fileReader.onloadend = handleFileRead;
          fileReader.readAsText(files[0]);
    }

  render() {
    const s = {
      width: '31vw', 
      height: '25vw',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px',
      marginLeft: '5vw'
    };
    return (
    <div>
     {/*
      <input type='file'
        id='file'
        accept='.txt'
        onChange={e => this.handleFile(e.target.files[0])}
      />
     */}
      <ReactDropzone
        id="dropzone"
        style={s}
        onDrop={this.onDrop}
        accept='.txt'
      > 
      </ReactDropzone>
    </div>
    );
  }
}
