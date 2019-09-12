import React, { Component, Fragment } from 'react'
import { Header } from './layouts'
import Trainings from './trainings'
import APIMap from './APIMap'
import './App.css'

const trainingsUrl = '/data/locations.json';

export default class extends Component {
  constructor(props){
    super(props)
    this.state = {
      locations : [],
      isLoading : true,
      modifiedLocations : [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.validInput = this.validInput.bind(this)
  }

  handleChange(newValue,siteID,dataType,sessionid,date){
    var newData = [...this.state.locations]

    if (dataType && date) {
      newData[siteID].sessions[sessionid][dataType][date] = newValue
    } else {
      newData[siteID].sites.adresse[dataType] = newValue
    }

    this.setState({
      modifiedLocations : newData
    })
    
  }
  validInput(){
   /* let temp = [...this.state.modifiedLocations]
    console.log(temp)
    this.setState({
      locations : temp     
    })
    console.log(this.state.locations)*/
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
        locations : responseJson,
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
      />

      <APIMap
        locations={this.state.locations}
      />

    </Fragment>
  }
}