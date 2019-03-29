import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import styles from './style.less';
import SendIcon from './send.png';

const divStyle = {
  position: 'absolute',
  display: 'flex',
  padding: 5,
  top: 5,
  left: 5,
  width: 360,
  background: 'white',
};
const poiIcon = {
  width: 36,
  height: 36,
};

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.loadUI();
  }

  /* 拖拽 */
  loadUI = () => {
    const { __map__ } = this.props;
    const { AMap } = window;
    window.AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], (PositionPicker, PoiPicker) => {
      /* 搜索定位 */
      const poiPicker = new PoiPicker({
        input: 'address',
        placeSearchOptions: {
          map: __map__,
          pageSize: 6,
        },
      });
      poiPicker.on('poiPicked', (result) => {
        let poiAddress;
        const { item, source } = result;
        if (source === 'suggest') {
          poiAddress = item.district + item.address;
        } else if (source === 'search') {
          poiAddress = `${item.pname}${item.cityname}${item.adname}${item.address}`;
        }
        this.props.dragPosition({
          ...item.location,
          address: poiAddress,
        });
        document.getElementById('address').value = item.name;
        __map__.panTo([item.location.lng, item.location.lat]);
      });

      /* 拖拽定位 */
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: __map__,
        iconStyle: {
          url: 'http://webapi.amap.com/theme/v1.3/markers/b/mark_r.png',
          size: [25, 35],
          ancher: [10, 10],
        },
      });
      positionPicker.start();
      __map__.panBy(0, 1);
    });
    __map__.on('dragend', () => {
      const center = __map__.getCenter();
      AMap.plugin('AMap.Geocoder', () => {
        const autoOptions = { city: '全国' };
        const geocoder = new AMap.Geocoder(autoOptions);
        geocoder.getAddress([center.lng, center.lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.props.dragPosition({
              ...center,
              address: result.regeocode.formattedAddress,
            });
          }
        });
      });
    });
  }
  render() {
    return (
      <Fragment>
        <div style={divStyle}>
          <img alt="send" style={poiIcon} src={SendIcon} />
          <input id="address" className={styles.poiSearch} placeholder="搜索位置" />
          <Icon type="search" className={styles.searchIcon} />
          <button onClick={this.props.handleClear} className={styles.clear}>清除定位</button>
        </div>
      </Fragment>
    );
  }
}
