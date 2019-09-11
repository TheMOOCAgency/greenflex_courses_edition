import React, {  } from 'react';
import 'typeface-roboto';
import './index.css';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid} from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default ({ locations }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>L'API Google map</Paper>
        </Grid>
      </Grid>
    </div>
  );
}