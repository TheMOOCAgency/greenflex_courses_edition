import React, { Component, Fragment } from 'react'
import Trainings from './trainings/training_list'
import './App.css'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      of_value: "Formation",
      of_name: "Formation",
      course_id: "course_id",
      isLoading: true,
      snackMessage: { open: "false", type: 'info', message: '', },
    }
    this.updatelocations = this.updatelocations.bind(this)
  }

  updatelocations(newData) {
    this.setState({
      locations: newData,
    });
  }

  componentWillMount() {
    let temp = {};
    if (window.props && window.props.locations) {
      temp = JSON.parse(JSON.stringify(window.props.locations));
    }
    if (window.props && window.props.of_value) {
      this.setState({
        of_value: window.props.of_value,
        of_name: window.props.of_name,
        course_id: window.props.course_id,
      });
    }
    this.setState({
      locations: temp,
      isLoading: false
    });
    if (window.props && window.props.error) {
      temp = JSON.parse(JSON.stringify(window.props.error));
    }
  }

  render() {
    return <Fragment>
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
      <Trainings
        locations={this.state.locations}
        of_value={this.state.of_value}
        of_name={this.state.of_name}
        course_id={this.state.course_id}
        updatelocations={this.updatelocations}
      />
    </Fragment>
  }
}