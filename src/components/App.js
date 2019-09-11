import React, { Component, Fragment } from 'react'
import { Header } from './layouts'
import Trainings from './trainings'
import APIMap from './APIMap'
import './App.css'

const trainingsUrl = '/data/locations.json';

export default class extends Component {
  state = {
    locations : [],
    isLoading : true,
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
      />

      <APIMap
        locations={this.state.locations}
      />

    </Fragment>
  }
}