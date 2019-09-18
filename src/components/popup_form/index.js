import React from 'react';
import './index.css';
import {Dialog, DialogContent, styled, Container, TextField, Typography, Grid, Slide, Tooltip, IconButton, Divider} from '@material-ui/core/';
import * as styledMU from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircle from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

const GridSessions = styled(Grid)({
    marginBottom: '15px',
    marginTop: '15px',
});

const HeadContainer = styled(Container)({
    paddingTop: 20
});

const TextFieldCoord = styled(TextField)({
    width: '90%',
});

const TextFieldSession = styled(TextField)({
    margin: '5px',
});

const CloseIconStyled = styled(CloseIcon)({
    cursor: 'pointer'
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PaddingTypography = styledMU.styled(Typography)({
    paddingRight: 10
});

export default class PopupForm extends React.Component {
    constructor(props){
        super(props)
        this.getElementDetail = this.getElementDetail.bind(this)
        this.getFormatedDate = this.getFormatedDate.bind(this)
        this.closeAndCancelModifications = this.closeAndCancelModifications.bind(this)
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

    render() {
        // console.log(this.props.modified);
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
                        {this.props.modifiedTraining.nom ? (
                            <DialogContent>
                                <Typography
                                    component='h1'
                                    variant='h2'
                                    align='center'
                                    color='textPrimary'
                                    gutterBottom
                                >{this.props.modifiedTraining.nom}</Typography>
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
                        {/* COORDONNEES DE LA FORMATION */ }
                        <Grid container>
                        {this.props.modifiedTraining.sites &&
                        this.props.getAdress(this.props.modifiedTraining).map(function(element, i){
                            return <Grid item xs={12} sm={6} md key={i}>
                                <TextFieldCoord
                                    id={element}
                                    key={i}
                                    label={element}
                                    style={{ margin: 8 }}
                                    disabled={element !== 'voie'}
                                    defaultValue={this.getElementDetail(element)}
                                    onChange={(e)=>{
                                        this.props.handleChange(e.target.value,this.props.modifiedTraining.sites.id,element)
                                        this.props.setModified(true);
                                    }}
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        },this)}
                        </Grid>
                    <Divider variant="middle" />
                        {/* LISTE DES SESSIONS */}
                        {this.props.modifiedTraining.sessions &&
                            this.props.modifiedTraining.sessions.map((rep, index) => {
                        return (
                            <div
                                key={index}
                            >
                            <GridSessions 
                                alignContent="center"
                                container
                            >
                                {/* SUPPRIMER UNE SESSION */}
                                <Grid item xs={6} sm={6} md={1} lg={1}>
                                    <Tooltip title={'Supprimer la session'}>
                                    <IconButton
                                        aria-label={'Supprimer la session'}
                                        color='primary'
                                        onClick={() => {
                                            this.props.deleteSessionInTrainingModified(this.props.deleteSession(rep.site_id, index));
                                            this.props.setModified(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    </Tooltip> 
                                </Grid>
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                    <PaddingTypography variant='h6' align='center'>
                                    {"Session " + (index + 1)}
                                    </PaddingTypography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    <TextFieldSession
                                        id={"subscribeStartDate" + index}
                                        label="Début des inscriptions"
                                        type="date"
                                        defaultValue={this.getFormatedDate(rep.inscription.debut)}
                                        onChange={(e)=>{
                                            this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'inscription',index,'debut');
                                            this.props.setModified(true);
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextFieldSession
                                        id={"subscribeEndDate" + index}
                                        label="Fin des inscriptions"
                                        type="date"
                                        defaultValue={this.getFormatedDate(rep.inscription.fin)}
                                        onChange={(e)=>{
                                            this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'inscription',index,'fin');
                                            this.props.setModified(true);
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    <TextFieldSession
                                        id={"TrainingStartDate" + index}
                                        label="Début de la formation"
                                        type="date"
                                        defaultValue={this.getFormatedDate(rep.periode.debut)}
                                        onChange={(e)=>{
                                            this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'periode',index,'debut');
                                            this.props.setModified(true);
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextFieldSession
                                        id={"TrainingEndDate" + index}
                                        label="Fin de la formation"
                                        type="date"
                                        defaultValue={this.getFormatedDate(rep.periode.fin)}
                                        onChange={(e)=>{
                                            this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'periode',index,'fin');
                                            this.props.setModified(true);
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </GridSessions>
                            <Divider variant="middle" />
                            </div>
                        );
                    })}
                    {/* AJOUTER UNE SESSION */}
                    <Grid container justify='center'>
                        <Tooltip title={'Ajouter une session'}>
                            <IconButton
                                aria-label={'Ajouter une session'}
                                color='primary'
                                onClick={() => {
                                    this.props.addNewTempSession(this.props.addNewSession(this.props.modifiedTraining.sites.id))}}
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
                                onClick={() => this.props.validation(this.props.handleClose, this.props.modifiedTraining.sites.id)}
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