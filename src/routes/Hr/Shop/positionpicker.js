import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';


const spanStyle = {
  position: 'absolute',
  top: '0',
  width: 200,
};
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = debounce((e) => {
      this.autoInput(e);
    }, 800);
    this.loadUI();
  }

  state = {
    value: undefined,
  }

  loadUI = () => {
    const { __map__ } = this.props;
    const { AMap } = window;
    window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      /* 拖拽定位 */
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: __map__,
      });
      positionPicker.start();
      __map__.panBy(0, 1);
    });
    __map__.on('dragend', () => {
      const center = __map__.getCenter();
      AMap.plugin('AMap.Autocomplete', () => {
        // 实例化Autocomplete
        const autoOptions = { city: '全国' };
        const geocoder = new AMap.Geocoder(autoOptions);
        geocoder.getAddress([center.lng, center.lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            console.log(status, result);
          }
        });
      });
    });
  }

  search = (e) => {
    this.setState({ value: e.target.value }, this.handleSearch(this.state.value));
  }

  autoInput = (keyWords) => {
    const { AMap } = window;
    AMap.plugin('AMap.Autocomplete', () => {
      // 实例化Autocomplete
      const autoOptions = { city: '全国' };
      const autoComplete = new AMap.Autocomplete(autoOptions);
      autoComplete.search(keyWords, (status, result) => {
        if (status === 'complete' && result.count) {
          console.log(status, result);
        }
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <div style={spanStyle}>
          <Input
            value={this.state.value}
            placeholder="请输入搜索地址"
            onChange={e => this.search(e)}
          />
        </div>
      </React.Fragment>
    );
  }
}
