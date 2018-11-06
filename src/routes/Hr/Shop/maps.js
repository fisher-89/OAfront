import React, { PureComponent } from 'react';
import { Map } from 'react-amap';
import ACfun from './autocomplete';

export default class extends PureComponent {
  constructor() {
    super();
    this.toolEvents = {
      created: (tool) => {
        this.tool = tool;
      },
    };
    this.mapPlugins = ['ToolBar'];
  }

  handlePosition = (poi) => {
    this.props.form.setFieldsValue({
      latitude: poi.lat,
      longitude: poi.lnt,
      address: poi.address,
    });
  }

  render() {
    const { initialValue } = this.props;
    const mapCenter = { longitude: initialValue.lng || '120', latitude: initialValue.latitude || '30' };
    const loadingStyle = {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    const Loading = <div style={loadingStyle}>Loading Map...</div>;
    return (
      <div style={{ width: '100%', height: '400px' }}>
        <Map
          amapkey="9a54ee2044c8fdd03b3d953d4ace2b4d"
          loading={Loading}
          center={mapCenter}
          plugins={this.mapPlugins}
          zoom={15}
          useAMapUI
        >
          <ACfun handlePosition={this.handlePosition} />
        </Map>
      </div>
    );
  }
}
