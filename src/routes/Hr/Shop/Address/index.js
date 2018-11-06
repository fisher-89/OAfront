import React, { PureComponent } from 'react';
import { Map } from 'react-amap';
import { keys } from 'lodash';
import PTfun from '../positionpicker';

export default class Address extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      value,
      address: value.address || '',
      position: value.position || { longitude: '120', latitude: '30' },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (!keys(this.state.value).length && 'value' in nextProps) {
      this.setState({ value, address: value.address, position: value.position });
    }
  }

  handlePosition = (position) => {
    console.log(position);
    const value = {
      address: position.address,
      position: { longitude: position.position.lng, latitude: position.position.lat },
    };
    this.setState({ value, ...value });
  }

  handleInputChange = (e) => {
    this.setState({ address: e.target.value });
  }

  render() {
    const { position, address } = this.state;
    return (
      <div style={{ width: '100%', height: '400px', position: 'relative' }} >
        <Map
          amapkey="9a54ee2044c8fdd03b3d953d4ace2b4d"
          // loading={Loading}
          zoom={15}
          useAMapUI
          center={position}
        >
          <PTfun
            address={address}
            handleInput={this.handleInputChange}
            handlePosition={this.handlePosition}
          />
        </Map>
      </div>
    );
  }
}

Address.default = {
  onChange: () => { },
};
