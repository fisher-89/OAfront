import { PureComponent } from 'react';
import { message } from 'antd';

export default class extends PureComponent {
  constructor() {
    super();
    this.loadUI();
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      const { __map__, handlePosition } = this.props;
      // 加载PositionPicker
      const positionPicker = new PositionPicker({
        mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
        map: __map__, // 依赖地图对象
      });
      // TODO:事件绑定、结果处理等

      positionPicker.on('success', (positionResult) => {
        handlePosition(positionResult);
        console.log(positionResult);
      });
      positionPicker.on('fail', () => {
        message.error('请重试');
      });
      positionPicker.start(__map__.getBounds().getCenter());
      __map__.panBy(0, 1);
    });
  }
  render() {
    return null;
  }
}
