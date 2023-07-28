import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import "./App.css";
import Cow from "./cow";
import { storage, db} from "./firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref as sref, push, set, onValue, get } from "firebase/database";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      likedSongs: [],
      is_playing: "Paused",
      progress_ms: 0,
      no_data: false,
      user: null,
      uploaded: false,
      mmm:true,
    };

  }



  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });

      this.getUserInfo(_token)
      this.fetchLikedSongs(_token)
    }

    // set interval for polling every 5 seconds
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  getUserInfo(token) {
    $.ajax({
      url: "https://api.spotify.com/v1/me",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log(data)
        this.setState({
          user: data,
        });
      },
      error: error => {
        console.log(error)
      }
    });
  }


  fetchLikedSongs(token, url = "https://api.spotify.com/v1/me/tracks") {
    $.ajax({
      url: url,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        if (!data || data.items.length === 0) {
          this.setState({
            no_data: true,
          });
          return;
        }
  
        // Extract the liked songs from the data response
        const likedSongs = data.items.map(item => item.track);
        this.setState(prevState => ({
          likedSongs: [...prevState.likedSongs, ...likedSongs], // Merge with previous results
        }));
  
        // If there are more tracks, fetch the next page
        if (data.next) {
          this.fetchLikedSongs(token, data.next);
        }else{
          console.log("done")
          if(this.state.mmm){
            this.setState({
              mmm:false,
            })

            this.saveLikedSongs()
          }
        }
      },
      error: error => {
        // Handle error, if any
        console.error("Error fetching liked songs:", error);
        this.setState({
          no_data: true,
        });
      }
    });
  };

  async saveLikedSongs(){

    const chunkedSongs = this.state.likedSongs.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 5);
      
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])

    try{

      const userSnap = await getDoc(doc(db, "users/", this.state.user.id, "/chunks/", String(chunkedSongs.length-1)));
      console.log(userSnap.exists())
      if (userSnap.exists()) {
        this.setState({
          uploaded: true,
        });
        return
      } else {
        console.log("creating")
        for (let i = 0; i < chunkedSongs.length; i++) {
          console.log(i)
          console.log(chunkedSongs[i])
          await setDoc(doc(db, "users/",this.state.user.id,"/chunks/", String(i)), {
            data: chunkedSongs[i],
            name: this.state.user.display_name,
          });
          
        }
      }

      this.setState({
        uploaded: true,
      });

    }catch(e){
      console.log(e)
      console.log("Firestore error - oop")
      this.setState({
        uploaded: true,
      });

    }
    

    console.log(this.state.user)
    for(let i = 0; i < this.state.likedSongs.length; i++){
      //console.log(this.state.likedSongs[i])
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {!this.state.token && (
            <a 
              className="btn btn--loginApp-link smallbob"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Connect Your Spotify
            </a>
          )}
          {this.state.token && (<Cow/>)}
          {this.state.token && !this.state.uploaded && (
            <div style={{position:'fixed', top:'50', zIndex:4, color:'red', fontSize:"3rem", fontWeight:500}}>
              DON'T LEAVE YET <br></br> <br></br> <br></br> THE DATA IS STILL UPLOADING
              </div>
          )}
        </div>
        <div style={{position:'fixed',bottom:5,left:5,fontSize:"0.3rem",color:"gray",fontWeight:50}}>your information probably won't be stolen</div>
      </div>
    );
  }
}

export default App;