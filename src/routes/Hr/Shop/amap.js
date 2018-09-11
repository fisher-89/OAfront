import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import { Map } from 'react-amap';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';
import UIMarker from './UIMarker';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ shop }) => ({ shop }))
export default class extends PureComponent {
  constructor() {
    super();
    this.state = {
      shopInfo: {},
      poiInfo: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps;
    if (initialValue !== this.state.shopInfo) {
      this.setState({ shopInfo: initialValue });
    }
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const body = {
      ...params,
    };
    dispatch({
      type: 'shop/positionShop',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  handlePosition = (poi) => {
    this.props.form.setFieldsValue({
      latitude: poi.lat,
      longitude: poi.lng,
      address: poi.address,
    });
  }

  render() {
    const {
      handleVisible,
      visible,
      onCancel,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    const { shopInfo, poiInfo } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    console.log(poiInfo);
    return (
      <OAModal
        title="店铺定位表单"
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {getFieldDecorator('id', {
          initialValue: shopInfo.id,
        })(
          <Input placeholder="请输入" type="hidden" />
        )}

        {getFieldDecorator('latitude', {
          initialValue: (poiInfo.lat || shopInfo.lat),
        })(
          <Input type="hidden" placeholder="请输入" />
        )}

        {getFieldDecorator('longitude', {
          initialValue: (poiInfo.lng || shopInfo.lng),
        })(
          <Input type="hidden" placeholder="请输入" />
        )}

        {getFieldDecorator('shop_sn', {
          initialValue: shopInfo.shop_sn,
        })(
          <Input type="hidden" placeholder="请输入" />
        )}

        {getFieldDecorator('name', {
          initialValue: shopInfo.name,
        })(
          <Input type="hidden" placeholder="请输入" />
        )}

        <FormItem {...formItemLayout} label="店铺位置" required>
          {getFieldDecorator('address', {
              initialValue: poiInfo.address,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

        <div style={{ width: '100%', height: '400px' }}>
          <Map
            zoom={15}
            useAMapUI="true"
            center={{
              longitude: (poiInfo.lng || shopInfo.lng),
              latitude: (poiInfo.lat || shopInfo.lat),
            }}
            amapkey="9a54ee2044c8fdd03b3d953d4ace2b4d"
          >
            <UIMarker handlePosition={this.handlePosition} />
          </Map>
        </div>
      </OAModal>
    );
  }
}
