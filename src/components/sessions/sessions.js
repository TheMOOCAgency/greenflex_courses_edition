import React from 'react';
import {styled, TextField, Typography, Grid, Tooltip, IconButton, Switch, withStyles, Card, CardContent} from '@material-ui/core/';
import * as styledMU from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import './sessions.css';

const GridSessions = styled(Grid)({
    marginBottom: '15px',
    marginTop: '15px',
});

const TextFieldSession = styled(TextField)({
    margin: '5px',
});

const PaddingTypography = styledMU.styled(Typography)({
    paddingRight: 10
});

const AntSwitch = withStyles(theme => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: '#52d869',
          borderColor: '#52d869',
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
      height: '14px',
    },
    checked: {},
}))(Switch);

export default class Sessions extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            currentObject : {...this.props.rep},
            hasLoaded : false,
            demiJournee1 : null,
            demiJournee2 : null,
            demiJournee3 : null,
            demiJournee4 : null
        }
    }
    getElementDetail(element) {
        return this.props.modifiedTraining.sites.adresse[element]
    }

    getFormatedDate(date) {
        date=date.split('/');
        date=date[2]+'-'+date[1]+'-'+date[0];
        return date
    }

    getJsonDate(date) {
        date=date.split('-');
        date=date[2]+'/'+date[1]+'/'+date[0];
        return date
    }

    closeAndCancelModifications() {
        this.props.handleClose(this.props.cancelChange(this.props.modified))
    }

    componentWillMount(){
        this.setState({
            hasLoaded : true
        })
    
    }

    handleChange(typeOfModification,e,i){
        let tempObject = {...this.props.rep}
        const regexDate = /demiJourneeDate\d/
        const regexDemi = /demiJourneeDemi\d/
        
        if(typeOfModification === "debut"){
            tempObject.periode.debut = this.getJsonDate(e.target.value)
            this.setState({
                currentObject : {...tempObject}
            },()=>{
                this.props.updateSessions(this.state.currentObject,this.props.index)
            })
            
        }else if(typeOfModification === "fin"){
            tempObject.periode.fin = this.getJsonDate(e.target.value);
            this.setState({
                currentObject : {...tempObject}
            },()=>{
                this.props.updateSessions(this.state.currentObject,this.props.index)
            })
        }else if(regexDate.test(typeOfModification)){
            tempObject.periode['demi_journee_'+i][1] = this.getJsonDate(e.target.value);
            this.setState({
                currentObject : {...tempObject}
            },()=>{
                this.props.updateSessions(this.state.currentObject,this.props.index)
            })
        }else if(typeOfModification === "ouverte"){
            if (tempObject.periode.ouverte !== true) {
                tempObject.periode.ouverte = true;
            } else {
                tempObject.periode.ouverte = false;
            }
            this.setState({
                currentObject : {...tempObject}
            },()=>{
                this.props.updateSessions(this.state.currentObject,this.props.index)
            })
        }else if(regexDemi.test(typeOfModification)){
            if (tempObject.periode['demi_journee_'+i][0] == 'matin') {
                tempObject.periode['demi_journee_'+i][0] = 'soir';
            } else {
                tempObject.periode['demi_journee_'+i][0] = 'matin';
            }
            this.setState({
                currentObject : {...tempObject}
            },()=>{
                this.props.updateSessions(this.state.currentObject,this.props.index)
            })
        }
        this.props.setModified(true);
    }

    render() {
        const fieldsDemiJournees = []
        if (this.props.distancielle) {
            for (let i = 1; i < 5; i++) {
                fieldsDemiJournees.push(<Grid
                    alignContent="center"
                    container
                    key={i}
                >
                    <Grid item xs={4} sm={1} style={{ marginRight:'10px' }}>{this.props.rep.periode['demi_journee_'+i][0] === 'matin' ? 'Matin' : 'Soir'}</Grid>
                    <Grid item xs={4} sm={1}>
                        <AntSwitch
                        checked={this.props.rep.periode['demi_journee_'+i] && this.props.rep.periode['demi_journee_'+i][0] !== 'matin'}
                        onChange={(e)=>{
                            this.handleChange("demiJourneeDemi"+i,e,i);
                        }}
                        />
                    </Grid>
                
                    <TextFieldSession
                        xs={12} sm={9} md={9} lg={9}
                        id={"TrainingDemi_journee_"+i}
                        label={"demi journée "+i}
                        type="date"
                        value={this.getFormatedDate(this.props.rep.periode['demi_journee_'+i] && this.props.rep.periode['demi_journee_'+i][1], 'distancielle')}
                        onChange={(e)=>{
                            this.handleChange("demiJourneeDate"+i,e,i);
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>)
            }
        }
        return (
            this.state.hasLoaded ?
            (
                <Card className="cardSession">
                    <CardContent>
                        <GridSessions 
                        alignContent="center"
                        container
                        >
                        <Grid item xs={12} sm={3} md={3} lg={2}
                            container
                            justify='center'>
                            {/* DELETE A SESSION*/}
                            <Tooltip title={'Supprimer la session'}>
                                <IconButton
                                    aria-label={'Supprimer la session'}
                                    color='primary'
                                    onClick={(e) => {
                                        this.props.deleteSessionInTrainingModified(this.props.index);
                                        this.props.setModified(true)
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip> 
                            {/* SESSION NUMBER */}
                            <PaddingTypography variant='h6' align='center' className="sessionNumber">
                            {"Session " + (this.props.index + 1)}
                            </PaddingTypography>
                        </Grid>
                        {/* SHOW OPEN/CLOSE SESSION SWITCH */}
                        <Grid
                            component="label"
                            container
                            justify='center'
                            alignItems="center"
                            item xs={12} sm={3} md={3} lg={4}
                        >
                            <Grid item style={{ marginRight:'10px' }}>{this.props.rep.periode.ouverte ? 'Ouvertes' : 'Fermées'}</Grid>
                            <Grid item>
                                <AntSwitch
                                checked={this.props.rep.periode.ouverte}
                                onChange={(e)=>{
                                    this.handleChange("ouverte",e);
                                }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            {this.props.distancielle ?
                            <>
                            {fieldsDemiJournees}
                            </>
                            : <>
                            <TextFieldSession
                                id={"TrainingStartDate" + this.props.index}
                                label="Début de la formation"
                                type="date"
                                value={this.getFormatedDate(this.props.rep.periode.debut)}
                                onChange={(e)=>{
                                    this.handleChange("debut",e);
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextFieldSession
                                id={"TrainingEndDate" + this.props.index}
                                label="Fin de la formation"
                                type="date"
                                value={this.getFormatedDate(this.props.rep.periode.fin)}
                                onChange={(e)=>{
                                    this.handleChange("fin",e);
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            </>}
                        </Grid>
                    </GridSessions>
                </CardContent>
            </Card>
            ):
            (<h1>Loading ...</h1>)
        );
    }
}