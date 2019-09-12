import React from 'react';
import './index.css';
import {Dialog, DialogContent, styled, Container, TextField, Typography, Grid, Slide, Tooltip, IconButton, Divider, MenuItem} from '@material-ui/core/';
import * as styledMU from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
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

const BackgroundContainer = styledMU.styled(Container)({
    paddingTop: '20px',
    paddingBottom: '30px',
    backgroundColor: 'rgba(243, 144, 0, 0.1)',
    maxWidth: 'none'
});

const CenterContentGrid = styledMU.styled(Grid)({
    width: 168,
    height: 177,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
});

const PaddingTypography = styledMU.styled(Typography)({
    paddingRight: 10
});

export default class PopupForm extends React.Component {
    constructor(props){
        super(props)
        this.getElementDetail = this.getElementDetail.bind(this)
        this.getFormatedDate = this.getFormatedDate.bind(this)
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

    render() {
        // console.log(this.props.modifiedTraining);
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.props.handleClose}
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
                    {/* <DialogContent> */}
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
                                    defaultValue={this.getElementDetail(element)}
                                    onChange={(e)=>{this.props.handleChange(e.target.value,this.props.modifiedTraining.sites.id,element)}}
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
                    {/* </DialogContent> */}
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
                            <Grid item xs={6} sm={6} md={1} lg={1}>
                                <Tooltip title={'Supprimer la session'}>
                                <IconButton
                                    aria-label={'Supprimer la session'}
                                    color='primary'
                                    // onClick={() => this.switchOpenDelete('session', index)}
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
                                    onChange={(e)=>{this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'inscription',index,'debut')}}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextFieldSession
                                    id={"subscribeEndDate" + index}
                                    label="Fin des inscriptions"
                                    type="date"
                                    defaultValue={this.getFormatedDate(rep.inscription.fin)}
                                    onChange={(e)=>{this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'inscription',index,'fin')}}
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
                                    onChange={(e)=>{this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'periode',index,'debut')}}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextFieldSession
                                    id={"TrainingEndDate" + index}
                                    label="Fin de la formation"
                                    type="date"
                                    defaultValue={this.getFormatedDate(rep.periode.fin)}
                                    onChange={(e)=>{this.props.handleChange(this.getJsonDate(e.target.value),this.props.modifiedTraining.sites.id,'periode',index,'fin')}}
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
                            >
                                <AddCircle />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid container justify='flex-end'>
                        <Tooltip title={'Quitter en sauvegardant les modifications'}>
                            <DoneIcon
                                aria-label='sauvegarder'
                                onClick={() => this.props.validation()}
                            />
                        </Tooltip>
                        <Tooltip title={'Quitter sans sauvegarder'}>
                            <CloseIconStyled
                                aria-label='Fermer le modal'
                                onClick={() => this.props.handleClose('config')}
                            />
                        </Tooltip>
                    </Grid>
                </Dialog>
            </div>
        )
    }
}