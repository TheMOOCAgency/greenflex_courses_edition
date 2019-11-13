import React from "react";
import Script from 'react-load-script'

class Search extends React.Component {
// Define Constructor
  constructor(props) {
    super(props);

    // Declare State
    this.state = {
      city: '',
      query: ''
    };
    this.handleScriptLoad=this.handleScriptLoad.bind(this)
  }

  handleScriptLoad() {
    var element = document.getElementById('user_input_autocomplete_address');
    console.log(document.getElementById('user_input_autocomplete_address'))
    if (element) {
      /*global google*/ // To disable any eslint 'google not defined' errors
      this.autocomplete = new google.maps.places.Autocomplete(element, { types: ['geocode'] });
      google.maps.event.addListener(this.autocomplete, 'place_changed', this.onPlaceChanged);
      console.log(this.autocomplete)
    }
  }

  onPlaceChanged() {
    var place = this.getPlace();

    console.log(place);  // Uncomment this line to view the full object returned by Google API.

    for (var i in place.address_components) {
      var component = place.address_components[i];
      for (var j in component.types) {  // Some types are ["country", "political"]
        var type_element = document.getElementById(component.types[j]);
        if (type_element) {
          type_element.value = component.long_name;
        }
      }
    }
  }

  // componentDidMount() {
  //   const that = this;
  //   window.google.maps.event.addDomListener(window, 'load', function() {
  //     that.handleScriptLoad('user_input_autocomplete_address');
  //   });
  // }

  // // Define Constructor
  // constructor(props) {
  //   super(props);

  //   // Declare State
  //   this.state = {
  //     city: '',
  //     query: ''
  //   };
  //   this.handleScriptLoad=this.handleScriptLoad.bind(this);
  //   this.handlePlaceSelect=this.handlePlaceSelect.bind(this);
  // }

  // handleScriptLoad = () => {
  //   // Declare Options For Autocomplete
  //   const options = {
  //     types: ['(cities)'],
  //   };

  //   // Initialize Google Autocomplete
  //   /*global google*/ // To disable any eslint 'google not defined' errors
  //   this.autocomplete = new google.maps.places.Autocomplete(
  //     document.getElementById('user_input_autocomplete_address'),
  //     options,
  //   );

  //   // Avoid paying for data that you don't need by restricting the set of
  //   // place fields that are returned to just the address components and formatted
  //   // address.
  //   this.autocomplete.setFields(['address_components', 'formatted_address']);

  //   // Fire Event when a suggested name is selected
  //   this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  //   //console.log(this.autocomplete)
  // }
  
  // handlePlaceSelect = () => {
    
  //   // Extract City From Address Object
  //   const addressObject = this.autocomplete.getPlace();
  //   const address = addressObject.address_components;
    
  //   console.log(address)

  //   // Check if address is valid
  //   if (address) {
  //     // Set State
  //     this.setState(
  //       {
  //         city: address[0].long_name,
  //         query: addressObject.formatted_address,
  //       }
  //     );
  //   }
  // }

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
              <form role="autoCompleteForm" className="form-horizontal">
                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-4 control-label">Address</label>
                    <div className="col-sm-8">
                      <input
                        id="user_input_autocomplete_address"
                        name="user_input_autocomplete_address"
                        className="form-control"
                        placeholder="Indiquez votre adresse..."
                      />
                    </div>
                  </div>
                </fieldset>
                <fieldset className="disabled">
                  <div className="form-group">
                    <label className="col-sm-4 control-label">
                      <code>street_number</code>
                    </label>
                    <div className="col-sm-8">
                      <input
                        id="street_number"
                        name="street_number"
                        disabled={true}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-4 control-label">
                      <code>route</code>
                    </label>
                    <div className="col-sm-8">
                      <input
                        id="route"
                        name="route"
                        disabled={true}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-4 control-label">
                      <code>locality</code>
                    </label>
                    <div className="col-sm-8">
                      <input
                        id="locality"
                        name="locality"
                        disabled={true}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-4 control-label">
                      <code>administrative_area_level_1</code>
                    </label>
                    <div className="col-sm-8">
                      <input
                        id="administrative_area_level_1"
                        name="administrative_area_level_1"
                        disabled={true}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-4 control-label">
                      <code>postal_code</code>
                    </label>
                    <div className="col-sm-8">
                      <input
                        id="postal_code"
                        name="postal_code"
                        disabled={true}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-4 control-label">
                      <code>country</code>
                    </label>
                    <div className="col-sm-8">
                      <input
                        id="country"
                        name="country"
                        disabled={true}
                        className="form-control"
                      />
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