import React from "react";
import SearchBar from 'material-ui-search-bar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingComponent:true,
      city: '',
      query: ''
    }
    this.handleScriptLoad = this.handleScriptLoad.bind(this)
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
  }

  handleScriptLoad = () => {
    console.log(document.getElementById('autocomplete2'))
    // Declare Options For Autocomplete
    const options = {
      types: ['(cities)'],
    };

    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options,
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    this.autocomplete.setFields(['address_components', 'formatted_address']);

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    console.log(this.autocomplete)
    console.log()

  }

  handlePlaceSelect = () => {
    // Extract City From Address Object
    const addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;
    console.log(addressObject,address)
    // Check if address is valid
    if (address) {
      // Set State
      this.setState(
        {
          city: address[0].long_name,
          query: addressObject.formatted_address,
        }
      );
    }
  }
  
  componentDidMount() {
    this.setState(
        {
            loadingComponent: false,
        }, () => this.handleScriptLoad()
    );
  }

  render() {
    return (
      <MuiThemeProvider>
        <>
          {this.state.loadingComponent ? <div>Chargement...</div> : 
            <SearchBar
                id="autocomplete"
                placeholder=""
                hinttext="Trouver une adresse"
                value={this.state.query}
                onChange={(e) => console.log(e)}
                onRequestSearch={(e) => console.log(e)}
                style={{
                    margin: '0 auto',
                    maxWidth: 800,
                }}
            />
          }
        </>
      </MuiThemeProvider>
    );
  }
}

export default Search;