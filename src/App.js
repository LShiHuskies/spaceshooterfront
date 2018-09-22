import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import World from './components/World'
import Login from './components/Login'

let userArray = []
let allGames = []
let gameArray = []
let userMatch = []


class App extends Component {
 state = {
   loggedIn: false,
   userNameValue: "",
   userPassword: "",
   currentUser: "",
   currentGames: [],
   allUsers: [],
   infoArray: [],
   scoreFilter: [],
   highScoreToggle: false,
 }

  handleChange = (event) => {
    if (event.target.type === "text") {
    this.setState({
      userNameValue: event.target.value,
      userPassword: this.state.userPassword
    })
    }
    else  {
      this.setState({
        userPassword: event.target.value,
        userNameValue: this.state.userNameValue
      })
    }

  }

  componentDidMount() {
    fetch("https://space-shooter-api.herokuapp.com//users").then(r => r.json()).then(data => this.setState({
      allUsers: data
    })
    )

  }


  filterGames = (data) => {
    if (this.state.currentGames.length === 0){
    this.setState({
      currentGames: data,
      highScoreToggle: true,
    })
    this.state.allUsers.map(user => this.state.currentGames.filter(game => {if (game.user_id == user.id){
      let userInstance = user.username
      let gameScore = game.score

      this.setState({
        infoArray: [...this.state.infoArray, {user : userInstance, score :gameScore}]
      })
    }
    }))
    let scores = this.state.infoArray.sort (function (d, e) {
      return e.score - d.score
    })
    this.setState({
      scoreFilter: scores
    })
  }
    else {
      this.setState({
        scoreFilter: [],
        currentGames: [],
        infoArray: [],
        highScoreToggle: false,
      });
    }
  }

  handleClick = (event) => {
    fetch("https://space-shooter-api.herokuapp.com//games").then(r => r.json()).then(data => this.filterGames(data))

  }

  getUsers(data) {
    data.map(user => userArray.push(user))
    let match = userArray.find(user => user.username === this.state.userNameValue)
    if (match !== undefined) {
      this.setState({
        currentUser: match,
        loggedIn: true
      })
    }
    else {
      const body = {
          username: this.state.userNameValue,
          password: this.state.userPassword
      }
      let config =  {
      method:'POST',
      headers:{
          'Content-type':'application/json',
          'Accept': 'application/json'
              },
      body:JSON.stringify(body)
      }
      fetch("https://space-shooter-api.herokuapp.com//users", config).then(r => r.json()).then(data => this.setState({loggedIn: true, currentUser: data }))
    }

  }

  handleSubmit = (event) => {
    event.preventDefault()
    fetch("https://space-shooter-api.herokuapp.com//users").then(r=> r.json()).then(data => this.getUsers(data))
  }

  render() {


    return (
        <div style={{position:"absolute", backgroundImage: 'url(https://www.macleans.ca/wp-content/uploads/2014/07/stars-carousel.jpg)', height: "100%", width: "100%"}}>
          {this.state.loggedIn == false ? <Login highScoreToggle={this.state.highScoreToggle} scoreFilter={this.state.scoreFilter} handleClick={this.handleClick} userNameValue={this.state.userNameValue} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/> : <World currentUser={this.state.currentUser}/>}
        </div>
    );
  }
}

export default App;


/* {
  "name": "spaceshooterfront",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "0.9.1",
    "eslint": "^4.13.1",
    "npm": "^6.4.0",
    "react": "^16.5.2",
    "react-dom": "^16.5.2",
    "react-keydown": "^1.9.7",
    "react-scripts": "1.1.5",
    "debug": "^2.6.8",
    "pkg-dir": "^2.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "engines": {
    "node": "7.8.0",
    "npm": "4.2.0"
  },
  "devDependencies": {
    "eslint": "^4.19.1",
    "eslint-config-strongloop": "^2.1.0",
    "eslint-loader": "^2.1.1",
    "eslint-plugin-import": "^2.14.0"
  }
} */
