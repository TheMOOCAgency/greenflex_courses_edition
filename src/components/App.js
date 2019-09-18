import React, { Component, Fragment } from 'react'
import Trainings from './trainings'
// import APIMap from './APIMap'
import './App.css'

const moment = require('moment');

const locationsFilter = { ofID: 0 };

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
  constructor(props) {
    super(props)
    this.state = {
      savedLocations: [],
      locations: [],
      isLoading: true,
      modifiedLocations: [],
      snackMessage: { open: "false", type: 'info', message: '', },
    }
    this.handleChange = this.handleChange.bind(this)
    this.validInput = this.validInput.bind(this)
    this.addNewSession = this.addNewSession.bind(this)
    this.pushNewSession = this.pushNewSession.bind(this)
    this.cancelChange = this.cancelChange.bind(this)
    this.clearSnack = this.clearSnack.bind(this)
    this.deleteSession = this.deleteSession.bind(this)
    this.checkModifiedDatas = this.checkModifiedDatas.bind(this)
    this.checkDates = this.checkDates.bind(this)
  }

  handleChange(newValue, siteID, dataType, sessionid, date) {
    let newData = JSON.parse(JSON.stringify(this.state.modifiedLocations))

    if (dataType && siteID && date && newValue) {
      newData[siteID].sessions[sessionid][dataType][date] = newValue
    } else if (dataType && siteID && newValue) {
      newData[siteID].sites.adresse[dataType] = newValue
    }

    this.setState({
      modifiedLocations: newData
    })
  }

  deleteSession(siteID, id) {
    let newData = JSON.parse(JSON.stringify(this.state.modifiedLocations));
    newData[siteID].sessions.splice(id,1);

    this.setState({
      modifiedLocations: newData,
    })
  }

  cancelChange(modified) {
    this.setState({
      modifiedLocations: this.state.locations,
    })
    if (modified) {
      this.setState({
        snackMessage: { open: "true", type: 'info', message: 'modifications annulées', },
      })
    }
  }

  validInput(callback, siteID) {
    let testResults = this.checkModifiedDatas(siteID);
    if (testResults.status) {
      let temp = JSON.parse(JSON.stringify(this.state.modifiedLocations))
  
      let formData = new FormData();
      formData.append('locations', JSON.stringify(temp))
  
      fetch(window.location.href, {
          method: 'POST',
          headers: {
              'X-CSRFToken': window.props.csrfToken
          },
          body: formData
      }).catch(function (error) {
          alert('An error has occurred, no data has been sent !')
      });
  
      this.setState({
        locations: temp,
        snackMessage: { open: "true", type: 'success', message: testResults.message, },
      })
  
      if (callback) {
        callback();
      }
    } else {
      // Erreur dans les saisies !
      this.setState({
        snackMessage: { open: "true", type: 'error', message: testResults.message, },
      })
    }
  }

  checkModifiedDatas(siteID) {
    let thisTraining = this.state.modifiedLocations[siteID];
    // Check coordinates validity
    // Here we need a system (DB ?) to compare what user write and what coordinates exist

    // Check dates validity
    for (let i = 0; i < thisTraining.sessions.length; i++) {
      let debutInscription = thisTraining.sessions[i].inscription.debut;
      let finInscription = thisTraining.sessions[i].inscription.fin;
      let debutPeriode = thisTraining.sessions[i].periode.debut;
      let finPeriode = thisTraining.sessions[i].periode.fin;

      // Date comparison between each start and end periode
      if (!this.checkDates(debutInscription, finInscription)) {
        return {status:false, message:'Session ' + (i+1) + ' : La date de fin d\'inscriptions ne doit pas être avant la date de début d\'inscription'}
      }
      if (!this.checkDates(debutPeriode, finPeriode)) {
        return {status:false, message:'Session ' + (i+1) + ' : La date de fin de formation ne doit pas être avant la date de début de formation'}
      }

      // Date comparison between end of "inscription" and start of "periode"
      if (!this.checkDates(finInscription, debutPeriode)) {
        return {status:false, message:'Session ' + (i+1) + ' : La date de début de formation ne doit pas être avant la date de fin d\'inscriptions'}
      }
    }

    return {status:true, message:'modifications enregistrées'}
  }

  checkDates(start, end) {
    let formatedStart=start.split('/');
    let formatedEnd=end.split('/');
    formatedStart=formatedStart[2]+'-'+formatedStart[1]+'-'+formatedStart[0];
    formatedEnd=formatedEnd[2]+'-'+formatedEnd[1]+'-'+formatedEnd[0];
    if (moment(formatedStart).isAfter(formatedEnd)) {
      return false
    }
    return true
  }

  clearSnack() {
    this.setState({
      snackMessage: { open: 'false', type: this.state.snackMessage.type, message: this.state.snackMessage.message, },
    })
  }

  pushNewSession(training) {
    moment.locale('en');
    training.sessions.push(
      {
        course_id: "course-v1%3Ainveest%2Binvest2019%2Binvest2019",
        enrollment_action: "enroll",
        id: this.state.locations[0].sessions.length,
        inscription: {
          debut: moment().format('DD/MM/YYYY'),
          fin: moment().format('DD/MM/YYYY')
        },
        periode: {
          debut: moment().format('DD/MM/YYYY'),
          fin: moment().format('DD/MM/YYYY')
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
      modifiedLocations: newData
    })
  }

  componentWillMount() {
    let temp = {};
    if (window.props && window.props.locations) {
      temp = JSON.parse(JSON.stringify(window.props.locations));
    }
    this.setState({
      savedLocations: temp,
      modifiedLocations: temp,
      locations: filterLocations(temp),
      isLoading: false
    });
    if (window.props && window.props.error) {
      temp = JSON.parse(JSON.stringify(window.props.error));
    }
  }

  render() {
    return <Fragment>
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
        deleteSession={this.deleteSession}
      />

      {/* <APIMap
        locations={this.state.locations}
      /> */}
    </Fragment>
  }
}