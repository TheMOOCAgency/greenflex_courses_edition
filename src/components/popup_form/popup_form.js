import React, {  } from 'react'
import './index.css';
import {Dialog, DialogContent, styled, Container, Typography, Grid, Slide, Tooltip, IconButton, Divider} from '@material-ui/core/';
import AddCircle from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Sessions from '../sessions/sessions';
import Coordinates from '../coordinates/coordinates';

const HeadContainer = styled(Container)({
    paddingTop: 20
});

const CloseIconStyled = styled(CloseIcon)({
    cursor: 'pointer'
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class PopupForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            temporaryDisplay :  JSON.parse(JSON.stringify(this.props.modifiedTraining)),
        }
        this.getElementDetail = this.getElementDetail.bind(this)
        this.getFormatedDate = this.getFormatedDate.bind(this)
        this.closeAndCancelModifications = this.closeAndCancelModifications.bind(this)
        this.updateSessions = this.updateSessions.bind(this)
        this.updateCoordinates = this.updateCoordinates.bind(this)
        this.deleteSessionInTrainingModified = this.deleteSessionInTrainingModified.bind(this)
        this.updateTemporaryDisplay = this.updateTemporaryDisplay.bind(this)
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
    componentDidUpdate(){
        if(this.props.open && Object.keys(this.state.temporaryDisplay).length === 0 && this.state.temporaryDisplay.constructor === Object){
            this.setState({
                temporaryDisplay :  JSON.parse(JSON.stringify(this.props.modifiedTraining))
            })
        }
    }

    tricks (data){
        this.props.setModifiedTraining(data)
    }
    
    updateTemporaryDisplay(tempData){
        this.setState({
            temporaryDisplay : JSON.parse(JSON.stringify(tempData)),
        },()=>{
            this.tricks(this.state.temporaryDisplay)
        })
        
    }

    updateCoordinates(currentData){
        let tempData = JSON.parse(JSON.stringify(currentData))
        this.updateTemporaryDisplay(tempData)
    }

    updateSessions(currentData,index){
        let tempData = JSON.parse(JSON.stringify(this.props.modifiedTraining))
        tempData.sessions[index] = currentData
        this.updateTemporaryDisplay(tempData)
    }

    deleteSessionInTrainingModified(index) {
        let tempData = JSON.parse(JSON.stringify(this.props.modifiedTraining));
        tempData.sessions.splice(index, 1);
        this.updateTemporaryDisplay(tempData)
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.closeAndCancelModifications}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="xl"
                >

                    <HeadContainer maxWidth='md'>
                        {this.props.modifiedTraining.nom && !this.props.creatingNewTraining ? (
                            <DialogContent>
                                <Typography
                                    component='h1'
                                    variant='h2'
                                    align='center'
                                    color='textPrimary'
                                    gutterBottom
                                >{this.props.modifiedTraining.of.nom + ' ' + this.props.modifiedTraining.sites.adresse.ville}</Typography>
                                <Typography
                                    variant='h5'
                                    align='center'
                                    color='textSecondary'
                                    paragraph
                                >
                                    Cette interface permet de modifier les coordonées ou les sessions de la formation.
                                </Typography>
                            </DialogContent>
                        ) : (
                                <DialogContent>
                                    <Typography
                                        component='h1'
                                        variant='h2'
                                        align='center'
                                        color='textPrimary'
                                        gutterBottom
                                    >{"Créer nouvelle formation"}</Typography>
                                    <Typography
                                        variant='h5'
                                        align='center'
                                        color='textSecondary'
                                        paragraph
                                    >
                                        Cette interface permet de créer un nouveau lieu de formation avec une ou plusieurs sessions.
                                    </Typography>
                                </DialogContent>
                            )}

                    </HeadContainer>
                    <Divider variant="middle" />
                    <Coordinates
                        modifiedTraining={this.props.modifiedTraining}
                        coordinatesTrad={this.props.coordinatesTrad}
                        getKeyAdressTrad={this.props.getKeyAdressTrad}
                        updateCoordinates={this.updateCoordinates}
                        setModified={this.props.setModified}
                    />
                    <Divider variant="middle" />
                    {/* LISTE DES SESSIONS */}
                    {this.props.modifiedTraining.sessions &&
                        this.props.modifiedTraining.sessions.map((rep, index) => {
                        return <Sessions
                                key={index}
                                index={index}
                                rep={rep}
                                modifiedTraining={this.props.modifiedTraining}
                                deleteSessionInTrainingModified={this.deleteSessionInTrainingModified}
                                setModified={this.props.setModified}
                                updateSessions={this.updateSessions}
                            />
                    })}
                    {/* AJOUTER UNE SESSION */}
                    <Grid container justify='center'>
                        <Tooltip title={'Ajouter une session'}>
                            <IconButton
                                aria-label={'Ajouter une session'}
                                color='primary'
                                onClick={() => {
                                    this.props.addNewSession(this.props.modifiedTraining, this.updateTemporaryDisplay)
                                }}
                            >
                                <AddCircle />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid container justify='flex-end'>
                        <Tooltip
                            title={'Quitter en sauvegardant les modifications'}
                        >
                            <div>
                            <IconButton
                                disabled={!this.props.modified}
                                aria-label='sauvegarder'
                                onClick={
                                    () => {this.props.checkModifiedDatas(this.props.modifiedTraining)}}
                            >
                                <DoneIcon />
                            </IconButton>
                            </div>
                        </Tooltip>
                        <Tooltip title={'Quitter sans sauvegarder'}>
                            <IconButton
                                aria-label='Fermer le modal'
                                onClick={() => 
                                    this.props.handleClose(this.props.cancelChange(this.props.modified))}
                            >
                                <CloseIconStyled />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Dialog>
            </div>
        )
    }
}