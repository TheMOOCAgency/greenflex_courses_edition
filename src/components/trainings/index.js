import React, { useState } from 'react';
import 'typeface-roboto';
import './index.css';
import MySnacks from '../snackbar'
import PopupForm from '../popup_form';
import {Paper, makeStyles, Grid, Typography, Fab, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CardContent, Card} from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    'background-color': '#C0DBDF',
  },
  fab: {
    margin: theme.spacing(1),
    'background-color': '#5CA8B8',
    color: '#294B52',
    'float': 'right',
    height: '36px',
    width: '36px',
    '&:hover': {
      'background-color': '#5C798F',
    },
  },
  add_new_formation: {
    float: 'none',
    'margin-top': '20px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  exp: {
    'background-color': '#9BC4D1',
    '&:hover': {
      background: "#71BED1",
    },
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
    'list-style-type': 'none',
    display: 'block',
    'background-color': '#9BC4D1',
    'text-align': 'left',
  },
  exp_header: {
    width: '50%',
    'text-align': 'left',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  card: {
    minWidth: 275,
  },
  coord: {
    'background-color': '#C3D9DE',
  },
  session_card: {
    'background-color': '#C0DBDF',
  },
  session_card_content: {
    'padding-top': '10px',
    'padding-bottom': '10px !important',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  session_button: {
    display: 'inline-block',
  },
  formation_info_titre: {
    display: 'inline-block',
    width: '15%',
    'vertical-align': 'middle',
  },
  formation_block_details: {
    display: 'inline-block',
    width: '70%',
    'vertical-align': 'middle',
  },
  formation_detail: {
    display: 'inline-block',
    'margin-right': 10,
    'margin-left': 10,
  },
}));

const getAdress = function (location) {
  var keys = [];
  for(var key in location.sites.adresse){
    keys.push(key);
  }
  return keys
}

export default function Locat(props) {
  const classes = useStyles();
  
  const [open, setOpen] = useState(false);
  const [modified, setModified] = useState(false);
  const [modifiedTraining, setModifiedTraining] = useState({ });
  
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClickClose(callback) {
    setModifiedTraining({});
    setModified(false);
    setOpen(false);
    if (callback && typeof callbak === 'function') {
      callback();
    }
  }

  function getModifiedTraining(location) {
    setModifiedTraining(JSON.parse(JSON.stringify(location)));
    handleClickOpen();
  }

  function addNewTempSession(callback) {
    let newData = JSON.parse(JSON.stringify(modifiedTraining));
    props.pushNewSession(newData);
    setModifiedTraining(newData);
    setModified(true);
    if (callback && typeof callback === "function") {
      callback();
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper variant="h6" component="h2" className={classes.paper}>LES FORMATIONS</Paper>
          <Paper className={classes.paper}>
            {props.locations.length === 0 &&
            <div>
              Aucune formation actuellement existante.
            </div>}
            {props.locations.map(function(location, i){
              return <ExpansionPanel
              // defaultExpanded
              key={i}>
                <ExpansionPanelSummary
                  className={classes.exp}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1c-content"
                  id="panel1c-header"
                >
                  <div className={classes.exp_header}>
                    <Typography variant="h6" component="h2" className={classes.heading}>{location.sites.nom}</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                <Card className={clsx(classes.card, classes.coord)}>
                  <CardContent>
                  <Typography variant="h6" component="h2" className={clsx(classes.heading, classes.formation_info_titre)}>
                    Coordonnées
                  </Typography>
                  <Fab aria-label="delete" title="Supprimer la formation" className={clsx(classes.fab)}>
                    <DeleteIcon />
                  </Fab>
                  <Fab color="secondary" title="Modifier la formation" aria-label="edit" className={clsx(classes.fab)} onClick={() => getModifiedTraining(location)}>
                    <EditIcon />
                  </Fab>
                    <div className={classes.formation_block_details}>
                      {getAdress(location).map(function(element, i){
                        let elementDetail = location.sites.adresse[element];
                        return <div key={i} className={classes.formation_detail}>
                        <Typography color="textSecondary">
                          {element} : 
                        </Typography>
                        <Typography variant="body2" component="p" 
                        key={i}>
                          {elementDetail}
                        </Typography>
                        </div>
                      })}
                    </div>
                  </CardContent>
                </Card>
                  {location.sessions.map(function(session, i){
                    return <li
                    key={i}>
                      <Card className={clsx(classes.card, classes.session_card)}>
                        <CardContent className={clsx(classes.session_card_content)}>
                          <Typography variant="h6" component="h2" className={clsx(classes.heading, classes.formation_info_titre)}>
                          Session {i + 1}
                          </Typography>
                          <div className={classes.formation_block_details}>
                          <Typography className={clsx(classes.formation_detail)} color="textSecondary">
                            inscriptions
                          </Typography>
                          <Typography variant="body2" component="p" className={clsx(classes.formation_detail)}>
                          du {session.inscription.debut} au {session.inscription.fin}
                          </Typography>
                          <Typography className={clsx(classes.formation_detail)} color="textSecondary">
                            période
                          </Typography>
                          <Typography variant="body2" component="p" className={clsx(classes.formation_detail)}>
                          du {session.periode.debut} au {session.periode.fin}
                          </Typography>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  })}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            })}
            <Fab color="secondary" aria-label="add" title="Ajouter une formation" className={clsx(classes.fab, classes.add_new_formation)} onClick={handleClickOpen}>
              <AddIcon />
            </Fab>
          </Paper>
        </Grid>
      </Grid>
      <PopupForm
        open={open}
        setOpen={setOpen}
        modified={modified}
        setModified={setModified}
        snackMessage={props.snackMessage}
        handleClose={handleClickClose}
        modifiedTraining={modifiedTraining}
        getAdress={getAdress}
        cancelChange={props.cancelChange}
        handleChange={props.handleChange}
        validation= {props.validation}
        addNewSession={props.addNewSession}
        addNewTempSession={addNewTempSession}
        pushNewSession={props.pushNewSession}
      />
      <MySnacks
        snackMessage={props.snackMessage}
        clearSnack={props.clearSnack}
      />
    </div>
  );
}