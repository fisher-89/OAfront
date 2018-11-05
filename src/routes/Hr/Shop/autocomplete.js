import { PureComponent } from 'react';
import { message } from 'antd';

export default class extends PureComponent {
  constructor() {
    super();
    this.loadUI();
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PoiPicker', 'misc/PositionPicker'], (PoiPicker, PositionPicker) => {
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
      // 用户选中的poi点信息
        const { item } = poiResult;
        handlePosition({
          lat: item.location.lat,
          lnt: item.location.lng,
          address: item.address,
        });
        __map__.panTo([item.location.lng, item.location.lat]);
      });

      // 加载PositionPicker
      const positionPicker = new PositionPicker({
        mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
        map: __map__, // 依赖地图对象
      });
        // TODO:事件绑定、结果处理等

      positionPicker.on('success', (positionResult) => {
        handlePosition({
          address: positionResult.address,
          lat: positionResult.position.lat,
          lng: positionResult.position.lng,
        });
        console.log(positionResult);
      });
      positionPicker.on('fail', () => {
        message.error('请重试');
      });
      positionPicker.start();
      __map__.panBy(0, 1);
    });
  }
  render() {
    return null;
  }
}
