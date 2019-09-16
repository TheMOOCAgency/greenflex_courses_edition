import React, { Component, Fragment } from 'react'
import { Header } from './layouts'
import Trainings from './trainings'
// import APIMap from './APIMap'
import './App.css'

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
      snackMessage : {open: "false", type: 'info', message: '',},
    }
    this.handleChange = this.handleChange.bind(this)
    this.validInput = this.validInput.bind(this)
    this.addNewSession = this.addNewSession.bind(this)
    this.pushNewSession = this.pushNewSession.bind(this)
    this.cancelChange = this.cancelChange.bind(this)
    this.clearSnack = this.clearSnack.bind(this)
  }

  handleChange(newValue,siteID,dataType,sessionid,date){
    var newData = JSON.parse(JSON.stringify(this.state.modifiedLocations))

    if (dataType && siteID && date && newValue) {
      newData[siteID].sessions[sessionid][dataType][date] = newValue
    } else if (dataType && siteID && newValue) {
      newData[siteID].sites.adresse[dataType] = newValue
    }

    this.setState({
      modifiedLocations : newData
    })
  }

  cancelChange() {
    this.setState({
      modifiedLocations : this.state.locations,
      snackMessage : {open: "true", type: 'info', message: 'modifications annulées',},
    })
    console.log('cancelation ! ', this.state.snackMessage);
  }

  validInput(callback){
    let temp = JSON.parse(JSON.stringify(this.state.modifiedLocations))
    this.setState({
      locations : temp,
      snackMessage : {open: "true", type: 'success', message: 'modifications enregistrées',},
    })
    console.log('validation ! ', this.state.snackMessage);
    if (callback) {
      callback();
    }
  }

  clearSnack() {
    this.setState({
      snackMessage : {open: "false", type: 'info', message: '',},
    })
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
    this.setState({ 
      savedLocations : JSON.parse(JSON.stringify(window.props.locations)),
      modifiedLocations : JSON.parse(JSON.stringify(window.props.locations)),
      locations : filterLocations(window.props.locations),
      isLoading : false
    });
  }

  render () {
    return <Fragment>
      <Header/>

      <Trainings
        locations={this.state.locations}
        snackMessage={this.state.snackMessage}
        handleChange={this.handleChange}
        validation={this.validInput}
        addNewSession={this.addNewSession}
        pushNewSession={this.pushNewSession}
        locationsFilter={this.locationsFilter}
        updateState={this.updateState}
        cancelChange={this.cancelChange}
        clearSnack={this.clearSnack}
      />

      {/* <APIMap
        locations={this.state.locations}
      /> */}
    </Fragment>
  }
}