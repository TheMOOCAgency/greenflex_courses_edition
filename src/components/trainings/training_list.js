import React from 'react';
import 'typeface-roboto';
import './training_list.css';
import MySnacks from '../snackbar/snackbar'
import PopupForm from '../popup_form/popup_form';
import Modal from '../delete_modal/modal';
import {Paper, Grid, Typography, Fab, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CardContent, Card} from '@material-ui/core/';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LanguageIcon from '@material-ui/icons/Language';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';

const moment = require('moment');

// Here we define how to sort and 'translate' coordinates, the sorting depend of keys indexes. The more close to 0 is the index, the more close to the top of the list is the key
const coordinatesTrad = {
  'ville':'Ville', 
  'pays':'Pays', 
  'region':'Région', 
  'departement':'Département', 
  'CP':'Code postal',
  'voie':'Voie',
};

export default class Trainings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      deleteWarning: false,
      modified: false,
      creatingNewTraining: false,
      deleteSiteId: 0,
      modifiedTraining: {},
      modifiedLocations: [],
      hasDistancielle: false,
      snackMessage: { open: "false", type: 'info', message: '', },
    }
    this.getModifiedTraining = this.getModifiedTraining.bind(this);
    this.deleteTraining = this.deleteTraining.bind(this);
    this.clearSnack = this.clearSnack.bind(this);
    this.createNewTraining = this.createNewTraining.bind(this);
    this.addNewTraining = this.addNewTraining.bind(this);
    this.getAdress = this.getAdress.bind(this);
    this.getKeyAdressTrad = this.getKeyAdressTrad.bind(this);
    this.setModified = this.setModified.bind(this);
    this.setModifiedTraining = this.setModifiedTraining.bind(this);
    this.cancelChange = this.cancelChange.bind(this);
    this.setCreatingNewTraining = this.setCreatingNewTraining.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.addNewSession = this.addNewSession.bind(this);
    this.checkModifiedDatas = this.checkModifiedDatas.bind(this);
    this.setDeleteWarning = this.setDeleteWarning.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.saveChanges = this.saveChanges.bind(this)
  }
  
  checkDistancielleExistance(locations){
    let hasDistancielle = false
    for (let i = 0; i < locations.length; i++) {
      if (locations[i].sites.distancielle) {
        hasDistancielle = true
      }
    }
    return hasDistancielle
  }
  
  componentDidMount(){
    let hasDistancielle = false
    this.setState({
      hasDistancielle: this.checkDistancielleExistance(this.props.locations),
    },()=>{
      console.log(hasDistancielle)
    })
  }
  
  saveChanges(newData, message){
    let that = this;
    let formData = new FormData();
    formData.append('locations', JSON.stringify(newData))

    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'X-CSRFToken': window.props.csrfToken
      },
      body: formData
    })
    .then(function(response) {
      if(response.status===200 || window.location.href ===  "http://localhost:3000/") {
        that.props.updatelocations(newData);

        if (message) {
          that.setState({
            snackMessage: { open: 'true', type: 'success', message: message, },
            hasDistancielle: that.checkDistancielleExistance(that.props.locations),
          })
        } else {
          that.setState({
            snackMessage: { open: 'true', type: 'success', message: 'modification enregistrée avec succès', },
            hasDistancielle: that.checkDistancielleExistance(that.props.locations),
          })
        }

      } else {
        that.setState({
          snackMessage: { open: "true", type: 'error', message: 'Erreur sur l\'enregistrement des données !', }
        });
      }
    });
  }

  getAdress(location) {

    // get unsorted adress list
    var keys = [];
    for(var key in location.sites.adresse){
      // Here we check if key exist in coordinatesTrad list, if it is not, it is not added in keys list
      if (coordinatesTrad[key])
      keys.push(key);
    }
  
    // sort adress list
    keys.sort(function(a, b) {
      return Object.keys(coordinatesTrad).indexOf(a) - Object.keys(coordinatesTrad).indexOf(b);
    });
    return keys
  }

  getKeyAdressTrad(element) {
    return coordinatesTrad[element]
  }

  setOpen(value) {
    if (value === true || value === false) {
      this.setState({
        open: value,
      })
    }
  }

  setModified(value) {
    if (value === true || value === false) {
      this.setState({
        modified: value,
      })
    }
  }

  setCreatingNewTraining(value) {
    if (value === true || value === false) {
      this.setState({
        creatingNewTraining: value,
      })
    }
  }

  setModifiedTraining(value) {
    if (typeof value === 'object') {
      this.setState({
        modifiedTraining: value,
      })
    }
  }

  setDeleteWarning(value) {
    if (value === true || value === false) {
      this.setState({
        deleteWarning: value,
      })
    }
  }
  
  handleClickOpen() {
    this.setOpen(true);
    this.setModified(false);
    this.clearSnack();
  }

  handleClickClose(callback) {
    this.setState({
      creatingNewTraining: false,
    })
    this.setModifiedTraining({});
    this.setOpen(false);
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  getModifiedTraining(location) {
    this.setModifiedTraining({...location});
    this.handleClickOpen();
  }

  createNewTraining(typeOfFormation) {
    let newTraining
    if (typeOfFormation === 'presentielle'){
      newTraining =
      {
        "course_id": this.props.course_id,
        "of": {
          "nom": this.props.of_name,
          "id": 0,
          "value": this.props.of_value
        },
        "sites": {
          "id": this.generateSiteID(),
          "of_id": 0,
          "nom": "Nouvelle formation",
          "tel": "01.00.00.00",
          "position": {
            "lat": 44.837789,
            "lng": -0.57918
          },
          "adresse": {
            "voie": "Inconnu",
            "ville": "Bordeaux",
            "CP": 3300,
            "pays": "France",
            "departement": "Gironde",
            "region": "Nouvelle-Aquitaine"
          }
        },
        "nom": "Nouvelle formation",
        "sessions": [
          {
            "enrollment_action": "enroll",
            "id": 0,
            "site_id": 0,
            "periode": {
              "debut": moment().format('DD/MM/YYYY'),
              "fin": moment().format('DD/MM/YYYY'),
              "ouverte": true,
            }
          },
        ]
      }
    } else {
      newTraining = {
        "course_id": this.props.course_id,
        "of": {
            "nom": this.props.of_name,
            "id": 0,
            "value": this.props.of_value
        },
        "sites": {
            "distancielle": true,
            "id": this.generateSiteID(),
        },
        "nom": "Nouvelle formation",
        "sessions": [{
            "course_id": this.props.course_id,
            "enrollment_action": "enroll",
            "periode": {
                "ouverte": true,
                "demi_journee_1": ["matin",moment().format('DD/MM/YYYY')],
                "demi_journee_2": ["soir",moment().format('DD/MM/YYYY')],
                "demi_journee_3": ["matin",moment().format('DD/MM/YYYY')],
                "demi_journee_4": ["soir",moment().format('DD/MM/YYYY')]
            },
            "site_id": 0,
            "id": 0
        }]
      }
    }

    let newData = [...this.state.modifiedLocations];
    newData.push(newTraining);

    this.setState({
      modifiedLocations: newData,
    })

    return newTraining
  }

  findTrainingBySiteID(siteID) {
    let thisTraining = {};
    let index = 0;
    for (let i = 0; i < this.props.locations.length; i++) {
      if (this.props.locations[i].sites.id === siteID) {
        thisTraining = this.props.locations[i];
        index = i;
      }
    }
    return { thisTraining: thisTraining, index: index }
  }

  checkModifiedDatas(dataToCheck) {
    let type = 'success';
    let message = 'modifications enregistrées';

    // Check dates validity
    if (!dataToCheck.sites.distancielle){
        for (let i = 0; i < dataToCheck.sessions.length; i++) {
          let debutPeriode = dataToCheck.sessions[i].periode.debut;
          let finPeriode = dataToCheck.sessions[i].periode.fin;
          
          if (!this.checkDates(debutPeriode, finPeriode)) {
            type = 'error';
            message = 'Session ' + (i + 1) + ' : La date de fin de formation ne doit pas être avant la date de début de formation';
          }
        }

      if (this.state.creatingNewTraining) {
          message = 'Nouvelle formation créée, à ' + dataToCheck.sites.adresse.ville;

        // Check coordinates validity (only one training per OF per adress ('Voie'))
        for (let i = 0; i < this.props.locations.length; i++) {
          if (!this.props.locations[i].sites.distancielle && (dataToCheck.sites.adresse.voie === this.props.locations[i].sites.adresse.voie && dataToCheck.sites.adresse.ville === this.props.locations[i].sites.adresse.ville)) {
            type = 'error';
            message = 'Il existe déjà une formation sur la ville de ' + dataToCheck.sites.adresse.ville + ' à l\'adresse ' + dataToCheck.sites.adresse.voie;
          }
        }
      }
    } else {
      message = 'Nouvelle formation distancielle créée'
    }
    
    if (type === 'success'){
      this.validation(dataToCheck);
    } else {
      this.setSnack(type, message);
    }
  }

  checkDates(start, end) {
    let formatedStart = start.split('/');
    let formatedEnd = end.split('/');
    formatedStart = formatedStart[2] + '-' + formatedStart[1] + '-' + formatedStart[0];
    formatedEnd = formatedEnd[2] + '-' + formatedEnd[1] + '-' + formatedEnd[0];
    if (moment(formatedStart).isAfter(formatedEnd)) {
      return false
    }
    return true
  }

  // remove snackbar
  clearSnack() {
    this.setState({
      snackMessage: { open: 'false', type: this.state.snackMessage.type, message: this.state.snackMessage.message },
    })
  }

  // Show a snackbar with a dynamic message
  setSnack(type, message) {
    this.setState({
      snackMessage: { open: 'true', type: type, message: message },
    })
  }

  generateSiteID() {
    // by default, sit_id is the length of the locations list
    let id = Math.floor(Math.random() * Math.floor(100000));

    // Here we check if this id is unused
    for (let i = 0; i < this.props.locations.length; i++) {
      if (this.props.locations[i].sites.id === id) {
        id = Math.floor(Math.random() * Math.floor(100000));

        // let's reset the id checking with a new random id !
        i = 0;
      }
    }
    return id
  }

  deleteTraining() {
    let newData = [...this.props.locations];
    const thisTraining = this.findTrainingBySiteID(this.state.deleteSiteId).thisTraining
    let localisation
    if (thisTraining.sites.distancielle) {
      localisation = 'distancielle '
    } else {
      localisation = 'de ' + thisTraining.sites.adresse.ville
    }
    this.setState({
      modifiedLocations: newData,
    },()=>{
      let index = this.findTrainingBySiteID(this.state.deleteSiteId).index;
      let message = 'Formation ' + localisation + ' supprimée avec succès.'
      newData.splice(index, 1);

      this.saveChanges(this.state.modifiedLocations, message);
    })
    this.setDeleteWarning(false);
  }

  openDeleteModal(siteID) {
    this.setState({
      deleteSiteId: siteID,
    })
    this.setDeleteWarning(true);
  }

  deleteSession(siteID, id, callback) {
    let newData = [...this.state.modifiedLocations];
    let index = this.findTrainingBySiteID(siteID).index;
    newData[index].sessions.splice(id, 1);

    this.setState({
      modifiedLocations: newData,
    })

    if (callback && typeof callback === 'function') {
      callback(newData[index]);
    }
  }

  // Activated when clicking cross or outside the form ('Quitter sans sauvegarder' in popupForm.js)
  cancelChange(modified) {
    this.setState({
      modifiedLocations: this.props.locations,
    })
    if (modified) {
      this.setState({
        snackMessage: { open: "true", type: 'info', message: 'modifications annulées', },
      })
    }
  }

  addNewTraining(typeOfFormation) {
    let newTraining = this.createNewTraining(typeOfFormation);
    this.setState({
      modifiedTraining: newTraining,
      creatingNewTraining: true,
    },()=>{
      this.handleClickOpen();
      this.setState({
        modified: true,
      })
    })
  }

  addNewTempSession(training) {
    this.addNewSession(training.sites.id);
    this.setModifiedTraining(training);
    this.setModified(true);
  }

  validation (newData) {
    let tempData = [...this.props.locations];

    // if it is not a new training, let's update an existing one
    if (!this.state.creatingNewTraining) {
      let thisTraining = this.findTrainingBySiteID(newData.sites.id);
      tempData[thisTraining.index] = newData;
    }
    // if it is a new training, let's push it in the list
    else {
      tempData.push(newData);
    }
    this.saveChanges(tempData);
    this.setOpen(false);
    this.setState({
      creatingNewTraining: false,
    })
  }

  pushNewSession(training) {
    const distancielle = training.sites.distancielle
    moment.locale('en');
    let periode
    if (distancielle) {
      periode = {
        ouverte: false,
        demi_journee_1: ['matin',moment().format('DD/MM/YYYY')],
        demi_journee_2: ['matin',moment().format('DD/MM/YYYY')],
        demi_journee_3: ['matin',moment().format('DD/MM/YYYY')],
        demi_journee_4: ['matin',moment().format('DD/MM/YYYY')]
      }
    } else {
      periode = {
        ouverte: false,
        debut: moment().format('DD/MM/YYYY'),
        fin: moment().format('DD/MM/YYYY')
      }
    }
    training.sessions.push(
      {
        course_id: this.props.course_id,
        enrollment_action: "enroll",
        id: this.state.modifiedLocations[0].sessions.length,
        periode: periode,
        site_id: training.sites.id,
      }
    )
  }

  addNewSession(dataToUpdate, callback) {
    let newData = [...this.props.locations]
    let index = this.findTrainingBySiteID(dataToUpdate.sites.id).index
    newData[index] = dataToUpdate;
    this.setState({
      modifiedLocations: newData
    }, () => {
      this.pushNewSession(dataToUpdate);
      this.setModifiedTraining(dataToUpdate);
      this.setModified(true);
      callback(dataToUpdate);
    })
  }
  
  render () {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper variant="h6" component="h2">LES FORMATIONS</Paper>
            <Paper>
              {this.props.locations.length === 0 &&
              <div>
                Aucune formation actuellement existante.
              </div>}
              
              {
                this.props.locations.map(function(location, i){
                return <ExpansionPanel
                key={i}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                    <div>
                      <Typography
                        display='inline'
                        variant="h6"
                        component="h2"
                        className="heading"
                      >
                        {location.sites.distancielle ?
                        location.of.nom + ' ' + 'Formations distancielles'
                        : location.of.nom + ' ' + location.sites.adresse.ville}
                      </Typography>
                      <Typography
                        display='inline'
                      >
                        {!location.sites.distancielle && ' (' + location.sites.adresse.voie + ')'}
                      </Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className="details">
                  <Card>
                    <CardContent>
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          item xs={12} sm={12} md={2} lg
                        >
                          <Typography variant="h6" component="h2">
                            Coordonnées
                          </Typography>
                        </Grid>
                          {this.getAdress(location).map(function(element, i){
                            let elementDetail = location.sites.adresse[element];
                            return <Grid
                            item xs={12} sm={4} md={2} lg
                              key={i}
                            >
                            <Typography color="textSecondary">
                              {this.getKeyAdressTrad(element)} : 
                            </Typography>
                            <Typography variant="body2" component="p" 
                            key={i}>
                              {elementDetail}
                            </Typography>
                          </Grid>
                        },this)}
                        <Grid
                          item xs={12} sm={4} md={2} lg
                        >
                          <Fab 
                            className="modifierButton"
                            aria-label="delete"
                            title="Supprimer la formation"
                            onClick={() => this.openDeleteModal(location.sites.id)}>
                            <DeleteIcon />
                          </Fab>
                          <Fab
                            className="modifierButton"
                            color="secondary"
                            title="Modifier la formation"
                            aria-label="edit"
                            onClick={() => this.getModifiedTraining(location)}>
                            <EditIcon />
                          </Fab>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                    {location.sessions.map(function(session, i){
                      return <li
                      key={i}>
                        <Card>
                          <CardContent>
                            <Grid
                              container
                            >
                              <Grid
                                item xs={12} sm={2} md={1}
                              >
                                <Typography variant="h6" component="h2">
                                Session {i + 1}
                                </Typography>
                              </Grid>
                              <Grid
                                item xs
                              >
                                {session.periode.ouverte === true ? (
                                  <Typography>
                                      Inscriptions ouvertes
                                  </Typography>
                                ) : (
                                  <Typography>
                                      Inscriptions fermées
                                  </Typography>
                                )}
                              </Grid>
                              <Grid
                                item xs
                              >
                                {location.sites.distancielle ?
                                    <>
                                    <Typography color="textSecondary" className="distDateTitle">
                                      Demi journées
                                    </Typography>
                                    <ul>
                                      <li className="distDate">1 : {session.periode.demi_journee_1[1]} ({session.periode.demi_journee_1[0]})</li>
                                      <li className="distDate">2 : {session.periode.demi_journee_2[1]} ({session.periode.demi_journee_2[0]})</li>
                                      <li className="distDate">3 : {session.periode.demi_journee_3[1]} ({session.periode.demi_journee_3[0]})</li>
                                      <li className="distDate">4 : {session.periode.demi_journee_4[1]} ({session.periode.demi_journee_4[0]})</li>
                                    </ul>
                                    </>
                                  : <>
                                    <Typography color="textSecondary">
                                      période
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                    du {session.periode.debut} au {session.periode.fin}
                                    </Typography>
                                    </>}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </li>
                    })}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              },this)}
              <Fab
                className="modifierButton"
                color="secondary" 
                aria-label="add" 
                title="Ajouter une formation présentielle" 
                onClick={() => this.addNewTraining('presentielle')}>
                <LocalLibraryIcon />
              </Fab>
              {!this.state.hasDistancielle && <Fab
                className="modifierButton"
                color="secondary" 
                aria-label="add" 
                title="Ajouter une formation distancielle" 
                onClick={() => this.addNewTraining('distancielle')}>
                <LanguageIcon />
              </Fab>}
            </Paper>
          </Grid>
        </Grid>

        <PopupForm
          open={this.state.open}
          setOpen={this.setOpen}
          creatingNewTraining={this.state.creatingNewTraining}
          setCreatingNewTraining={this.setCreatingNewTraining}
          modified={this.state.modified}
          setModified={this.setModified}
          handleClose={this.handleClickClose}
          modifiedTraining={this.state.modifiedTraining}
          getAdress={this.getAdress}
          getKeyAdressTrad={this.getKeyAdressTrad}
          cancelChange={this.cancelChange}
          addNewTempSession={this.addNewTempSession}
          deleteSession={this.deleteSession}
          setModifiedTraining={this.setModifiedTraining}
          checkModifiedDatas={this.checkModifiedDatas}
          addNewSession={this.addNewSession}
          coordinatesTrad={coordinatesTrad}
          hasDistancielle={this.state.hasDistancielle}
        />
        <MySnacks
          snackMessage={this.state.snackMessage}
          clearSnack={this.clearSnack}
        />
        <Modal
          deleteWarning={this.state.deleteWarning}
          setDeleteWarning={this.setDeleteWarning}
          deleteTraining={this.deleteTraining}
        />
      </div>
    );
  }
}