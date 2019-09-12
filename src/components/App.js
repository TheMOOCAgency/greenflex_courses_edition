import React, { Component, Fragment } from 'react'
import { Header } from './layouts'
import Trainings from './trainings'
// import APIMap from './APIMap'
import './App.css'

const trainingsUrl = '/data/locations.json';
const locationsFilter = {ofID:0, siteID:0};

const filterLocations = function (obj) {
  if (locationsFilter) {
    var result = {}, key;
    for (key in obj) {
      if (obj[key].of.id === locationsFilter.ofID && obj[key].sites.id === locationsFilter.siteID) {
        result = obj[key];
      }
    }
    return [result];
  } else {
    console.log('no filter, show all trainings')
    return obj
  }
}

export default class extends Component {
  constructor(props){
    super(props)
    this.state = {
      savedLocations : [],
      locations : [],
      isLoading : true,
      modifiedLocations : [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.validInput = this.validInput.bind(this)
    this.addNewSession = this.addNewSession.bind(this)
  }

  handleChange(newValue,siteID,dataType,sessionid,date){
    var newData = JSON.parse(JSON.stringify(this.state.locations))

    if (dataType && date) {
      newData[siteID].sessions[sessionid][dataType][date] = newValue
    } else {
      newData[siteID].sites.adresse[dataType] = newValue
    }

    this.setState({
      modifiedLocations : newData
    })
  }

  validInput(callback){
    let temp = [...this.state.modifiedLocations]
    this.setState({
      locations : temp     
    })
    if (callback) {
      callback();
    }
  }

  addNewSession() {
    
  }

  componentWillMount() {
    this.fetchLocations();
  }

  fetchLocations() {
    fetch(trainingsUrl)
    .then((response)=> {
       return response.json()
    })
    .then((responseJson) => {
      this.setState({ 
        locations : filterLocations(responseJson),
        isLoading : false
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render () {
    return <Fragment>
      <Header/>

      <Trainings
        locations={this.state.locations}
        handleChange={this.handleChange}
        validation={this.validInput}
        addNewSession={this.addNewSession}
      />

      {/* <APIMap
        locations={this.state.locations}
      /> */}

    </Fragment>
  }
}