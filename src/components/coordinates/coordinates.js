import React from 'react';
import { Grid, Typography } from '@material-ui/core/';
import Search from './searchGoogleCoordinates';

export default class PopupForm extends React.Component {
    constructor(props) {
        super(props)
        // this.getAdress = this.getAdress.bind(this)
        this.handleGoogleAutocomplete= this.handleGoogleAutocomplete.bind(this)
    }

    handleGoogleAutocomplete(address){
        let tempData = JSON.parse(JSON.stringify(this.props.modifiedTraining));
        tempData.sites.adresse.CP = address.CP;
        tempData.sites.adresse.departement = address.departement;
        tempData.sites.adresse.region = address.region;
        tempData.sites.adresse.ville = address.ville;
        tempData.sites.adresse.voie = address.voie;
        tempData.sites.position.lat = address.lat;
        tempData.sites.position.lng = address.lng;
        this.props.updateCoordinates(tempData);
        this.props.setModified(true);
        // console.log(tempData.sites.adresse)
    }

    render() {
        let address= {};
        if (this.props.modifiedTraining && this.props.modifiedTraining.sites && this.props.modifiedTraining.sites.adresse) {address=this.props.modifiedTraining.sites.adresse}
        return (
            <>
                <Search
                    handleGoogleAutocomplete={this.handleGoogleAutocomplete}
                />
                {/* COORDONNEES DE LA FORMATION */ }
                <Grid container>
                {this.props.modifiedTraining.sites &&
                <Grid item xs>
                    <Typography
                        component='h5'
                        variant='h5'
                        align='center'
                        color='textPrimary'
                        gutterBottom
                    >
                        { address.voie + ', ' + address.CP + ', ' + address.ville + ', ' + address.departement + ', ' + address.region + ', ' + address.pays }
                    </Typography>
                </Grid>
                }
                </Grid>
            </>
        )
    }
}