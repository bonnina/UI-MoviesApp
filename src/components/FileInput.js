import React from 'react';
import ReactDropzone from 'react-dropzone';
import DropzoneErrorBoundary from './DropzoneErrorBoundary';

export default class FileInput extends React.Component {
    onDrop = (files) => {
      let fileReader;
      const handleFileRead = (e) => {
        const str = fileReader.result;
        let arr = str.split('\n').map(el => el.split(': ')).filter((el, ind) => (ind + 1) % 5 !== 0);
       
        // loop through the file contents
        while(arr.length > 0) {
          // splice the first movie
          let movie = arr.splice(0, 4);
          let dataToPost = {
            "title": movie[0][1],
            "year": movie[1][1],
            "format": movie[2][1]
           };

          // creates or updates a movie 
          function updOrCreate(m) {
            let stars = movie[3][1].split(', ');
            var postActor = function (el) { 
              return new Promise((resolve, reject) => {
                // check if this actor already exists in a DB
                let myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                let url = `http://localhost:3000/stars/${el}`;
                fetch(url)
                .then(response => response.json())
                .then(resp => {
            console.log(resp[0]);
                  
                  // if there's no such actor in the DB, add one
                  if (resp[0] === undefined) {
            console.log("No such actor");
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
            console.log('Created actor: ', json);
                    resolve(json);
                  })
                  .catch(error => console.log(error.message, "In create actor"));
                  }
                  else {
            console.log("Match: " + el);
                    resolve({Id: resp[0].Id});
                  }
                })
                .catch(error => console.log(error.message));
              }); // end Promise
            };  // end func

            let actions = stars.map(postActor);
            Promise.all(actions)
              .then(data => {
                let idArr = data.map(el => el.Id);
                dataToPost.stars = idArr;
                let myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
          
                fetch('http://localhost:3000/movies', {
                  method: m,
                  headers: myHeaders,
                  body: JSON.stringify(dataToPost)
                })
                .then(response => response.json())
                .then(j => console.log('Movie Id: ' + j.movieId))
                .catch(error => console.log(error.message));
              })
              .catch(error => console.log(error.message));

            //  this.props.getMov();
          }

          // first, check if the movie already exists in DB
          let title = movie[0][1];
          let myHeaders = new Headers();
          myHeaders.append('Content-Type', 'application/json');
          let url = `http://localhost:3000/movies/${title}`;
          fetch(url)
          .then(response => response.json())
          .then(resp => {
            // if there's no such movie in DB, create one
            if (resp[0] === undefined) {
              updOrCreate('POST');
            }
            // if there is one, update movie details
            else {
              dataToPost.id = resp[0].Id;
              updOrCreate('PUT');
            }
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
    <DropzoneErrorBoundary>
      <ReactDropzone
        id="dropzone"
        style={s}
        onDrop={this.onDrop}
        accept='.txt'
      > 
      </ReactDropzone>
    </DropzoneErrorBoundary>
    </div>
    );
  }
}
