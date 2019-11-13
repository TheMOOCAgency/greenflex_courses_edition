import React from 'react';
import {styled, TextField, Grid, Select, MenuItem, FormControl} from '@material-ui/core/';
import Search from './searchGoogleCoordinates';

const TextFieldCoord = styled(TextField)({
    width: '90%',
});

// The list of all towns available for this app, list used to populate select menu while editing a training
const townlist = {
    'Bordeaux': {
      pays: 'France',
      region: 'Nouvelle-Aquitaine',
      departement: 'Gironde',
      CP: '33000',
      lat: 44.837789,
      lng: -0.57918,
    },
    'Lyon': {
      pays: 'France',
      region: 'Auvergne-Rhône-Alpes',
      departement: 'Rhône',
      CP: '69000',
      lat: 45.75,
      lng: 4.85,
    },
    'Marseille': {
        pays: 'France',
        region: 'Provence-Alpes-Côte d\'Azur',
        departement: 'Bouches-du-Rhône',
        CP: '13000',
        lat: 43.3,
        lng: 5.4,
    },
    'Nantes': {
      pays: 'France',
      region: 'Pays de la Loire',
      departement: 'Loire-Atlantique',
      CP: '44000',
      lat: 47.216667,
      lng: -1.55,
    },
    'Paris': {
      pays: 'France',
      region: 'Île-de-France',
      departement: 'Paris',
      CP: '75000',
      lat: 48.8534,
      lng: 2.3488,
    },
    'Strasbourg': {
        pays: 'France',
        region: 'Alsace',
        departement: 'Bas-Rhin',
        CP: '67000',
        lat: 48.5833,
        lng: 7.75,
    },
    'Toulouse': {
        pays: 'France',
        region: 'Occitanie',
        departement: 'Haute-Garonne',
        CP: '31000',
        lat: 43.6,
        lng: 1.433333,
    },
}

export default class PopupForm extends React.Component {
    constructor(props) {
        super(props)
        this.getAdress = this.getAdress.bind(this)
    }

    getElementDetail(element) {
        return this.props.modifiedTraining.sites.adresse[element]
    }

    closeAndCancelModifications() {
        this.props.handleClose(this.props.cancelChange(this.props.modified))
    }

    getAdress(location) {
        let that=this;

        // get unsorted adress list
        var keys = [];
        for(var key in location.sites.adresse){
            // Here we check if key exist in coordinatesTrad list, if it is not, it is not added in keys list
            if (that.props.coordinatesTrad[key])
            keys.push(key);
        }
        
        // sort adress list
        keys.sort(function(a, b) {
            return Object.keys(that.props.coordinatesTrad).indexOf(a) - Object.keys(that.props.coordinatesTrad).indexOf(b);
        });
        return keys
    }

    updateCoordinates(data, value){
        data.sites.adresse.CP = townlist[value].CP;
        data.sites.adresse.departement = townlist[value].departement;
        data.sites.adresse.region = townlist[value].region;
        data.sites.adresse.ville = value;
        data.sites.position.lat = townlist[value].lat;
        data.sites.position.lng = townlist[value].lng;
        this.props.updateCoordinates(data);
        this.props.setModified(true);
    }

    handleChange(typeOfModification,e){
        let tempObject = JSON.parse(JSON.stringify(this.props.modifiedTraining))

        if(typeOfModification === "Voie"){
            tempObject.sites.adresse.voie = e;
        } else if(typeOfModification === "Code postal"){
            tempObject.sites.adresse.CP = e;
        }

        this.props.updateCoordinates(tempObject);
        this.props.setModified(true);
    }

    render() {
        return (
            <>
                <Search />
                {/* COORDONNEES DE LA FORMATION */ }
                <Grid container>
                {this.props.modifiedTraining.sites &&
                this.getAdress(this.props.modifiedTraining).map(function(element, i){
                    return <Grid item xs={12} sm={12} md key={i}>
                        {element === 'ville' ? (
                        <FormControl variant="filled">
                            <Select
                                required
                                value={this.getElementDetail(element)}
                                id={element}
                                key={i}
                                label={this.getElementDetail(element)}
                                style={{ margin: 8 }}
                                onChange={(e)=>{
                                    let tempData = JSON.parse(JSON.stringify(this.props.modifiedTraining));
                                    this.updateCoordinates(tempData, e.target.value)
                                }}
                                inputProps={{
                                    name: 'ville',
                                    id: 'ville',
                                }}
                            >
                                {townlist && Object.keys(townlist).length > 0 &&
                                    Object.keys(townlist).map(function(town, i){
                                        // Town menu generation, based on townList object
                                        return <MenuItem key={i} value={town}>{town}</MenuItem>
                                      })
                                    }
                                }
                                
                            </Select>
                        </FormControl>
                        ) : (
                        <TextFieldCoord
                            id={element}
                            key={i}
                            label={this.props.getKeyAdressTrad(element)}
                            style={{ margin: 8 }}
                            defaultValue={this.getElementDetail(element)}
                            margin="normal"
                            variant="outlined"
                            disabled
                            onChange={(e)=>{this.handleChange(this.props.getKeyAdressTrad(element),e.target.value)}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        )}
                    </Grid>
                },this)}
                </Grid>
            </>
        )
    }
}