import React, { PureComponent, Fragment } from 'react';
import { Input, AutoComplete, Tooltip } from 'antd';
import { debounce } from 'lodash';
import './style.less';

const divStyle = {
  position: 'absolute',
  top: '0',
  width: 300,
};
const lowStyle = {
  position: 'absolute',
  bottom: 15,
  width: 300,
};
const fontStyle = {
  fontSize: 6,
};
const { Option } = AutoComplete;
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = debounce((info) => {
      this.autoComplete(info);
    }, 800);
    this.loadUI();
  }
  state = {
    value: this.props.value,
    dataSource: [],
  }

  /* 选择选项后定位 */
  onSelect = (value) => {
    if (this.state.dataSource[value].location) {
      const completeAddress = `${this.state.dataSource[value].district}${this.state.dataSource[value].address}`;
      const position = {
        address: completeAddress,
        position: {
          lng: this.state.dataSource[value].location.lng,
          lat: this.state.dataSource[value].location.lat,
        },
      };
      this.props.handlePosition(position);
      this.setState({ value: { address: completeAddress } });
    }
  }

  /* 拖拽 */
  loadUI = () => {
    const { __map__ } = this.props;
    const { AMap } = window;
    window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: __map__,
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
              address: result.regeocode.formattedAddress,
              position: center,
            });
            this.setState({
              value: {
                address: result.regeocode.formattedAddress,
                position: {
                  lng: center.lng,
                  lat: center.lat,
                },
              },
            },
            );
          }
        });
      });
    });
  }

  /* 搜索 */
  sendInput = (info) => {
    this.handleSearch(info);
  }

  autoComplete = (keywords) => {
    const { AMap } = window;
    AMap.plugin('AMap.Autocomplete', () => {
      // 实例化Autocomplete
      const autoOptions = { city: '全国' };
      const autoComplete = new AMap.Autocomplete(autoOptions);
      autoComplete.search(keywords, (status, result) => {
        // 搜索成功时，result即是对应的匹配数据
        if (status === 'complete' && result.count) {
          this.setState({ dataSource: Array.from(result.tips) });
        }
      });
    });
  }


  render() {
    const { dataSource, value } = this.state;
    const options = dataSource.map((item, index) => {
      const key = `${index}`;
      return (
        <Option key={key} text={`${item.district}${item.address}`}>
          <Tooltip title={`${item.district}${item.address}`} placement="right">
            <span>{item.name}</span>
            <span style={fontStyle}>&nbsp;&nbsp;&nbsp;{item.district}{item.address}</span>
          </Tooltip>
        </Option>
      );
    });
    return (
      <Fragment>
        <div style={divStyle}>
          <AutoComplete
            defaultValue={value.address}
            dataSource={options}
            onSelect={this.onSelect}
            onSearch={this.sendInput}
            placeholder="请输入"
            optionLabelProp="text"
          />
        </div>
        <div style={lowStyle}>
          <label>当前标签位置，仅供参考</label>
          <Input
            className="poiStyle"
            value={value.address}
            readOnly
          />
        </div>
      </Fragment>
    );
  }
}
