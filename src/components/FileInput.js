import React from 'react';
// https://www.papaparse.com/docs#strings

class FileInput extends React.Component {
  
    handleFileChosen = (file) => {
        let fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    handleFileRead = (e) => {
        const content = fileReader.result;
        console.log(content);
        // do something with the 'content'
    };

  render() {
   // let fileReader;
    return (
    <div>
        <input type='file'
               id='file'
               className='input-file'
               accept='.txt'
               onChange={e => handleFileChosen(e.target.files[0])}
        />
    </div>
    );
  }
}

export default FileInput;
