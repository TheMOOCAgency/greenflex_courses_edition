import React from "react";
import Script from 'react-load-script'
import { FormControl, Select } from '@material-ui/core/';

class Search extends React.Component {
  // Define Constructor
  constructor(props) {
    super(props);

    // Declare State
    this.state = {
      adressToSelect: [],
      adressSelection:{},
    };
    this.handleScriptLoad=this.handleScriptLoad.bind(this);
    this.handlePlaceSelect=this.handlePlaceSelect.bind(this);
  }

  handleScriptLoad = () => {
    /*global google*/ // To disable any eslint 'google not defined' errors
    // Autocomplete is used to get a list up to 5 address linked to user's input to populate the select menu
    this.autocompleteService = new google.maps.places.AutocompleteService()
    // PlacesService is used to get more informations about choosen address (code postal, departement, region, latitude, longitude)
    this.placesService = new google.maps.places.PlacesService(document.getElementById('user_input_autocomplete_address'))
  }

  handleInputChange = (target) => {
    if (target) {
      this.autocompleteService.getPlacePredictions(
        { 
          input: target,
          componentRestrictions: {country: 'fr'},
          types: ['address'],
        },
        predictions => {
          // console.log(predictions)
          this.setState(
            {
              adressToSelect: predictions,
            }
          );
        }
      );
    }
  }
  
  handlePlaceSelect = (e) => {
    let address = {
      voie: '',
      ville: '',
      departement: '',
      region: '',
      CP: 0,
      pays: 'France',
      lat: 0,
      lng: 0
    };
    let placeID = this.state.adressToSelect[e.target.value].place_id
    this.placesService.getDetails({placeId:placeID}, (results) => {
      let components = results.address_components;
      for (let i = 0; i < components.length; i++) {
        if (components[i].types[0] === 'street_number') {
          address.voie = components[i].long_name + ' ';
        } else if (components[i].types[0] === 'route') {
          address.voie += components[i].long_name;
        } else if (components[i].types[0] === 'locality') {
          address.ville = components[i].long_name;
        } else if (components[i].types[0] === 'administrative_area_level_2') {
          address.departement = components[i].long_name;
        } else if (components[i].types[0] === 'administrative_area_level_1') {
          address.region = components[i].long_name;
        } else if (components[i].types[0] === 'country') {
          address.pays = components[i].long_name;
        } else if (components[i].types[0] === 'postal_code') {
          address.CP = components[i].long_name;
        }
      }
      address.lat = (results.geometry.viewport.Ya.g + results.geometry.viewport.Ya.h) / 2;
      address.lng = (results.geometry.viewport.Ta.g + results.geometry.viewport.Ta.h) / 2;
      this.props.handleGoogleAutocomplete(address)
      this.setState(
        {
          adressToSelect: [],
        }
      );
      document.getElementById('user_input_autocomplete_address').value = null;
    })
  }

  render() {
    return ( 
      <>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyAfaYbXApQjGJR7Zpz3dli17flR_mNGNpY&libraries=places"
          onLoad={this.handleScriptLoad}
        />
          <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <hr />
            <form className="form-horizontal">
              <fieldset>
                <div className="form-group">
                  <label className="col-sm-4 control-label">Addresse à saisir</label>
                  <div className="col-sm-8">
                    <input
                      id="user_input_autocomplete_address"
                      name="user_input_autocomplete_address"
                      onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}
                      className="form-control"
                      placeholder="Indiquez votre adresse..."
                      onChange={(e) => this.handleInputChange(e.target.value)}
                      style={{ display: 'block', margin: 'auto' }}
                    />
                    {this.state.adressToSelect && this.state.adressToSelect.length > 0 &&
                    <FormControl variant="outlined">
                      <Select
                        native
                        value=""
                        onChange={(e) => {this.handlePlaceSelect(e)}}
                        inputProps={{
                          name: 'adress',
                          id: 'outlined-adress-native-simple',
                        }}
                      >
                        <option value={'default'}>{this.state.adressToSelect.length + ' adresses disponibles'}</option>
                        {this.state.adressToSelect.map(function(item, i){
                            return <option key={i} value={i}>{item.description}</option>
                          })
                        }
                      </Select>
                    </FormControl>
                    }
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Search;