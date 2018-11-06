import { PureComponent } from 'react';

export default class extends PureComponent {
  constructor() {
    super();
    this.loadUI();
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
      const { __map__, handlePosition } = this.props;
      const poiPicker = new PoiPicker({
        input: 'address', // 输入框id
        placeSearchOptions: {
          map: __map__,
          pageSize: 10,
          citylimit: false,
        },
      });
      // 监听poi选中信息
      poiPicker.on('poiPicked', (poiResult) => {
        const { item } = poiResult;
        // 用户选中的poi点信息
        handlePosition({
          lat: item.location.lat,
          lnt: item.location.lng,
          address: item.address,
        });
        __map__.panTo([item.location.lng, item.location.lat]);
      });
    });
  }
  render() {
    return null;
  }
}
