import React, { PureComponent } from 'react';
import { Map } from 'react-amap';

export default class extends PureComponent {
  render() {
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
        />
      </div>
    );
  }
}
