import React, { Component, Fragment } from 'react'
import { Header } from './layouts'
import Trainings from './trainings'
// import APIMap from './APIMap'
import './App.css'

const trainingsUrl = '/data/locations.json';
const locationsFilter = {ofID:0};

const filterLocations = function (obj) {
  if (locationsFilter) {
    let result = [], key;
    for (key in obj) {
      if (obj[key].of.id === locationsFilter.ofID) {
        result.push(obj[key]);
      }
    }
    return result;
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
    this.pushNewSession = this.pushNewSession.bind(this)
  }

  handleChange(newValue,siteID,dataType,sessionid,date){
    var newData = JSON.parse(JSON.stringify(this.state.modifiedLocations))

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
    let temp = JSON.parse(JSON.stringify(this.state.modifiedLocations))
    this.setState({
      locations : temp     
    })
    if (callback) {
      callback();
    }
  }

  pushNewSession(training) {
    training.sessions.push(
      {
        course_id: "course-v1%3Ainveest%2Binvest2019%2Binvest2019",
        enrollment_action: "enroll",
        id: this.state.locations[0].sessions.length,
        inscription: {
          debut: "00/00/0000",
          fin: "00/00/0000"
        },
        periode: {
          debut: "00/00/0000",
          fin: "00/00/0000"
        },
        site_id: locationsFilter.siteID,
      }
    )
  }

  addNewSession(siteID) {
    let newData = JSON.parse(JSON.stringify(this.state.modifiedLocations))
    let currentSiteID = 0;
    for (let i = 0; i < this.state.locations.length; i++) {
      if (this.state.locations[i].sites.id === siteID) {
        currentSiteID = i;
        i = this.state.locations.length;
      }
    }
    this.pushNewSession(newData[currentSiteID]);
    this.setState({
      modifiedLocations : newData
    })
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
        savedLocations : JSON.parse(JSON.stringify(responseJson)),
        locations : filterLocations(responseJson),
        isLoading : false
      });
      this.setState({ 
        modifiedLocations : JSON.parse(JSON.stringify(this.state.locations)),
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
        pushNewSession={this.pushNewSession}
        locationsFilter={this.locationsFilter}
        updateState={this.updateState}
      />

      {/* <APIMap
        locations={this.state.locations}
      /> */}

    </Fragment>
  }
}