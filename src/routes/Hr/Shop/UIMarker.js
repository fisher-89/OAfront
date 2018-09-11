import { PureComponent } from 'react';
import { message } from 'antd';

export default class extends PureComponent {
  constructor() {
    super();
    this.loadUI();
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], (PositionPicker, PoiPicker) => {
      const { __map__, handlePosition } = this.props;
      /* 搜索定位 */
      const poiPicker = new PoiPicker({
        input: 'address',
        placeSearchOptions: {
          map: __map__,
          pageSize: 6,
        },
      });
      poiPicker.on('poiPicked', (poiResult) => {
        const { item } = poiResult;
        handlePosition({
          lat: item.location.lat,
          lng: item.location.lng,
          address: item.district + item.address,
        });
        __map__.panTo([item.location.lng, item.location.lat]);
      });

      /* 拖拽定位 */
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: __map__,
      });
      positionPicker.on('success', (poi) => {
        handlePosition({
          lat: poi.position.lat,
          lng: poi.position.lng,
          address: poi.address,
        });
      });
      positionPicker.on('fail', () => {
        message.error('定位失败请重试');
      });
      positionPicker.start();
      __map__.panBy(0, 1);
    });
  }

  render() {
    return null;
  }
}
