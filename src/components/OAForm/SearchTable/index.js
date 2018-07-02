import React, { PureComponent } from 'react';
import { Modal, Tooltip, message } from 'antd';
import { connect } from 'dva';
import SelectTable from './selectTable';
import RadioInput from './input';
import CheckBoxTag from './tag';
import Staff from './Model/Staff';
import { getBrandAuthority, getDepartmentAuthority } from '../../../utils/utils';
import './index.less';


/**
 *  props {
 *     authority： false 是否开启权限
 *     multiple ： false 单选
 *     value : required
 *     name : 多选值 required  typeof 'object'
 *     showName:显示的值  required
 *     disabled ：是否禁用  默认  false
 *     placeholder：描述
 *     style：外部样式
 *     modelStyle：弹出层样式
 *     onChange：function(values)
 *     tableProps: {
 *       index：required 选择下标
 *     }
 * }
 *
 */

const defaultStyle = {
  width: '800px',
  height: '400px',
};

/**
 * 定制插件
 */
const type = {
  shop: {
    makeColumns: ({ department, brand }, access) => {
      let brandFilters = [];
      if (brand) {
        brand.forEach((item) => {
          if (getBrandAuthority(item.id)) {
            brandFilters.push({ text: item.name, value: item.id });
          }
        });
      }
      brandFilters = access ? brandFilters : (
        brand.map(item => ({ text: item.name, value: item.id }))
      );
      return [
        {
          title: '编号',
          dataIndex: 'shop_sn',
          sorter: true,
          searcher: true,
        },
        {
          title: '店铺',
          dataIndex: 'name',
          searcher: true,
          render: val => (
            <Tooltip title={val} placement="right">
              {val.length > 9 ? `${val.substr(0, 9)}...` : val}
            </Tooltip>
          ),
        },
        {
          title: '品牌',
          align: 'center',
          dataIndex: 'brand_id',
          filters: access ? brandFilters : brand.map(item => ({ text: item.name, value: item.id })),
          render: (val) => {
            const data = brand && brand.filter(item => item.id === val)[0];
            return data ? data.name : '';
          },
        }, {
          title: '部门',
          dataIndex: 'department_id',
          treeFilters: {
            title: 'full_name',
            value: 'id',
            parentId: 'parent_id',
            data: department && department.map((item) => {
              const temp = { ...item };
              if (access) {
                temp.disabled = !getDepartmentAuthority(item.id);
              }
              return temp;
            }),
          },
          render: (val) => {
            const data = department && department.filter(item => item.id === val)[0];
            const fullName = data ? data.full_name : '';
            return (
              <Tooltip title={fullName} placement="right">
                {fullName.length > 9 ? `${fullName.substr(0, 9)}...` : fullName}
              </Tooltip>
            );
          },
        },
        {
          title: '店员',
          dataIndex: 'staff',
          searcher: true,
          render: (val) => {
            let shopStaff = val.map(item => item.realname);
            shopStaff = shopStaff.join(',');
            return (
              <Tooltip title={shopStaff} placement="right">
                {shopStaff.length > 9 ? `${shopStaff.substr(0, 9)}...` : shopStaff}
              </Tooltip>
            );
          },
        },
      ];
    },
  },
};

/**
 * 定制插件开发的数据模型
 */

@connect(({ department, brand, shop, loading }) => ({
  brand: brand.brand,
  brandLoading: loading.models.brand,
  department: department.department,
  departmentLoading: loading.effects['department/fetchDepartment'],
  shop: shop.shop,
  shopTotal: shop.total,
  shopLoading: loading.models.shop,
}))

export default class SearchTable extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    const newValue = this.makeInitialValue(value);
    this.state = {
      visible: false,
      pushValue: newValue,
      modelStyle: props.modelStyle || defaultStyle,
    };
  }

  componentDidMount() {
    const { module, tableProps, dispatch } = this.props;
    if (Object.keys(type).indexOf(module) === -1 && !tableProps) {
      message.error(`没有找到该模型${module}的搜索代码，请在组件中添加相关模型代码`);
      return false;
    }
    switch (module) {
      case 'shop':
        dispatch({ type: 'brand/fetchBrand' });
        dispatch({ type: 'department/fetchDepartment', payload: {} });
        this.fetchDataSource = this.fetchShop;
        break;
      default:
        this.fetchDataSource = tableProps.fetchDataSource;
        break;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      const newValue = this.makeInitialValue(nextProps.value);
      this.setState({ pushValue: newValue });
    }
  }

  setTableValue = (changeValue) => {
    const { multiple } = this.props;
    this.pushValue = multiple ? changeValue : changeValue[0];
    if (!multiple) {
      this.setState({ pushValue: this.pushValue || [] }, () => {
        this.handleOk();
      });
    }
  };

  makeInitialValue = (value) => {
    const { name } = this.props;
    let newValue = [];
    if (this.props.multiple) {
      newValue = value.map((item) => {
        const temp = {};
        Object.keys(name).forEach((key) => {
          temp[name[key]] = item[key];
        });
        return temp;
      });
    } else {
      newValue = {};
      Object.keys(name).forEach((key) => {
        newValue[name[key]] = value[key];
      });
    }
    return newValue;
  }

  handleModelVisble = (flag) => {
    const { modalVisible } = this.props;
    this.setState({ visible: flag }, () => {
      if (modalVisible) {
        modalVisible(flag);
      }
    });
  };

  handleOk = () => {
    const { onChange, multiple, name } = this.props;
    const { pushValue } = this.state;
    this.handleModelVisble(false);
    if (multiple) {
      const value = [];
      this.pushValue.forEach((item, i) => {
        value[i] = {};
        Object.keys(name).forEach((key) => {
          value[i][key] = item[name[key]];
        });
      });
      this.setState({ pushValue: this.pushValue }, () => onChange(value));
      return;
    }
    const value = {};
    Object.keys(name).forEach((key) => {
      value[key] = pushValue[name[key]];
    });
    onChange(value);
  };

  makeTableProps = () => {
    const { module } = this.props;
    const { tableProps } = this.props;
    let newTableProps = {};
    switch (module) {
      case 'shop':
        newTableProps = this.makeShopProps(type[module]);
        break;
      default:
        newTableProps = tableProps;
        break;
    }
    return newTableProps;
  };


  /**
   *
   * 店铺shop搜索
   */
  fetchShop = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'shop/fetchShop', payload: params });
  };

  makeShopProps = (module) => {
    const {
      shop,
      shopTotal,
      shopLoading,
      brand,
      brandLoading,
      department,
      departmentLoading,
      authority,
    } = this.props;

    const tableProps = {
      data: shop,
      total: shopTotal,
      index: 'shop_sn',
      loading: (shopLoading || brandLoading || departmentLoading),
    };

    let access = false;
    if (authority) {
      access = true;
    }
    tableProps.columns = module.makeColumns({ brand, department }, access);
    return tableProps;
  };

  makeSearchView = () => {
    const { multiple, placeholder, disabled, showName } = this.props;
    const { visible, pushValue } = this.state;
    const tableProps = this.makeTableProps();
    const commonProps = {
      value: pushValue,
      disabled,
      placeholder,
      showName,
      valueName: tableProps.index,
      handleModelVisble: this.handleModelVisble,
    };
    return multiple ? (
      <CheckBoxTag
        {...commonProps}
        setTagSelectedValue={(removeIndex) => {
          const newValue = pushValue.filter((_, index) => index !== removeIndex);
          this.setTableValue(newValue);
          this.handleOk();
        }}
      />
    ) :
      (
        <RadioInput
          {...commonProps}
          modalVisible={visible}
          clearValue={() => {
            this.setTableValue([]);
          }}
        />
      );
  };

  render() {
    const { multiple, name, showName, title } = this.props;
    const { visible, modelStyle: { width }, pushValue } = this.state;
    const footer = multiple ? null : { footer: null };
    const tableProps = this.makeTableProps();
    let selectValue = [];
    if (multiple) {
      selectValue = pushValue;
    } else {
      selectValue = [pushValue[tableProps.index]] || [];
    }
    return (
      <div>
        {this.makeSearchView()}
        <Modal
          destroyOnClose
          style={this.state.modelStyle}
          width={width}
          title={title}
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleModelVisble(false)}
          {...footer}
        >
          {visible && (
          <SelectTable
            {...tableProps}
            name={name}
            showName={showName}
            multiple={multiple}
            selectValue={selectValue}
            fetchDataSource={this.fetchDataSource}
            setSelectedValue={this.setTableValue}
          />
        )}

        </Modal>
      </div>
    );
  }
}
SearchTable.defaultProps = {
  title: '员工列表',
  onChange: () => { },
};
SearchTable.Staff = Staff;

