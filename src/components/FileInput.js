import React from 'react';
import ReactDropzone from "react-dropzone";

export default class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        actorIds: []
    }
  }

    onDrop = (files) => {
      let fileReader;
      const handleFileRead = (e) => {
        const str = fileReader.result;
        let arr = str.split('\n').map(el => el.split(': ')).filter((el, ind) => (ind + 1) % 5 !== 0);
       
       while(arr.length > 0) {
          let movie = arr.splice(0, 4);
          let stars = movie[3][1].split(', ');
          console.log('Stars: ' + stars);
          let pr = this.props.stars;
          
          var postActor = function (el) { 
            return new Promise((resolve, reject) => {
              let goOn = true;
                pr.forEach(x => {
                    if (x.Name.toLowerCase() === el.toLowerCase()) {
                      console.log("Match: " + x.Name);
                      goOn = false;
                      resolve({Id: x.Id});
                    }
                });
              if (goOn) {
                let actor = {"name": el};
                let myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
    
                fetch('http://localhost:3000/stars', {
                  method: 'POST',
                  headers: myHeaders,
                  body: JSON.stringify(actor)
                })
                .then(response => response.json())
                .then(json => {
                  console.log(json);
                  resolve(json);
                })
                .catch(error => console.log(error.message));
              }
            });
          };
      
          let actions = stars.map(postActor);
          Promise.all(actions)
            .then(data => {
              let idArr = data.map(el => el.Id);
              let toPost = {
                "title": movie[0][1],
                "year": movie[1][1],
                "format": movie[2][1],
                "stars": idArr
               };
              let myHeaders = new Headers();
              myHeaders.append('Content-Type', 'application/json');
        
              fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(toPost)
              })
              .then(response => response.json())
              .then(j => console.log('Movie Id: ' + j.movieId))
              .catch(error => console.log(error.message));
            })
            .catch(error => console.log(error.message));
        }
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
