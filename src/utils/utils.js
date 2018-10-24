import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}

/**
 * 验证用户操作权限
 * @param {权限Id} authId
 */
export function customerAuthority(authId) {
  let authAble = false;
  if (window.user && Object.keys(window.user).length) {
    const { authorities: { oa } } = window.user;
    if (Array.isArray(authId)) {
      authId.forEach((id) => {
        if (oa.indexOf(parseInt(id, 10)) !== -1) {
          authAble = true;
        }
      });
    } else {
      authAble = oa.indexOf(parseInt(authId, 10)) !== -1;
    }
  }
  return authAble;
}


/**
 * 验证品牌权限
 */
export function getBrandAuthority(brandId) {
  if (window.user && Object.keys(window.user).length) {
    const availableBrands = window.user.authorities.available_brands;
    if (availableBrands.indexOf(parseInt(brandId, 10)) !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * 验证部门权限
 */
export function getDepartmentAuthority(departmentId) {
  if (window.user && Object.keys(window.user).length) {
    const availableDepartments = window.user.authorities.available_departments;
    if (availableDepartments.indexOf(parseInt(departmentId, 10)) !== -1) {
      return true;
    }
  }
  return false;
}

export function makePositionData(brandId, brand) {
  let conditions = brandId;
  if (brandId.in) {
    conditions = brandId.in;
  }
  const selectBrand = brand.filter(item => conditions.indexOf(item.id.toString()) !== -1);
  const pushPosition = [];
  selectBrand.forEach((item) => {
    if (item.positions.length > 0) {
      item.positions.forEach((p) => {
        const pushIndex = pushPosition.map(index => index.id);
        if (pushIndex.indexOf(p.id) === -1) {
          pushPosition.push(p);
        }
      });
    }
  });
  return pushPosition;
}


export function undotFieldsValue(fieldsValue) {
  const params = {};
  Object.keys(fieldsValue).forEach((key) => {
    const value = fieldsValue[key];
    let fieldsValueMd = params;
    const keyGroup = key.split('.');
    keyGroup.forEach((item, index) => {
      if (index === keyGroup.length - 1) {
        fieldsValueMd[item] = value;
      } else {
        fieldsValueMd[item] = fieldsValueMd[item] || {};
        fieldsValueMd = fieldsValueMd[item];
      }
    });
  });
  return params;
}

export function dotFieldsValue(fieldsValue, parentKey) {
  let response = {};
  Object.keys(fieldsValue || {}).forEach((key) => {
    const value = fieldsValue[key];
    const newKey = parentKey === undefined ? key : `${parentKey}.${key}`;
    if (Array.isArray(value)) {
      if (typeof value[0] === 'object') {
        response = {
          ...response,
          ...dotFieldsValue(value, newKey),
        };
      } else {
        response[newKey] = value;
      }
    } else if (value instanceof Error) {
      response[newKey] = value;
    } else if (typeof value === 'object') {
      response = {
        ...response,
        ...dotFieldsValue(value, newKey),
      };
    } else {
      response[newKey] = value;
    }
  });
  return response;
}

// table params

const whereConfig = {
  in: '=',
  like: '~',
  min: '>=',
  max: '<=',
  gt: '>',
  lt: '<',
};

export function dotWheresValue(fields) {
  let fieldsWhere = '';
  Object.keys(fields || {}).forEach((key) => {
    const name = key;
    if (typeof fields[key] === 'object') {
      Object.keys(fields[key]).forEach((i) => {
        let value = fields[key][i];
        if (Array.isArray(value) && value.length > 0) {
          value = value.length > 1 ? `[${value}]` : value[0];
        }
        if (value) {
          fieldsWhere += `${name}${whereConfig[i]}${value};`;
        }
      });
    } else if (fields[key]) {
      fieldsWhere += `${name}=${fields[key]};`;
    }
  });
  return fieldsWhere;
}

export function makerFilters(params) {
  const { filters } = { ...params };
  let newFilters = '';
  newFilters = dotWheresValue(filters);
  return {
    ...params,
    filters: newFilters,
  };
}

/* selectTree */

export function markTreeData(data = [], { value, lable, parentId }, pid = null) {
  const tree = [];
  data.forEach((item) => {
    if (item[parentId] === pid) {
      const temp = {
        value: item[value].toString(),
        title: item[lable],
        key: `${item[value]}`,
      };
      const children = markTreeData(data, { value, lable, parentId }, item[value]);
      if (children.length > 0) {
        temp.children = children;
      }
      tree.push(temp);
    }
  });
  return tree;
}


/**
 * 去重
 * @param {参数} array
 */
export function unique(array = []) {
  const newArr = [];
  array.forEach((item) => {
    if (newArr.indexOf(item) === -1) {
      newArr.push(item);
    }
  });
  return newArr;
}


/**
 * 数组交集
 * @param {数组1} a
 * @param {数组2} b
 */
export function intersect(a = [], b = []) {
  const result = [];
  b.forEach((temp) => {
    a.forEach((item) => {
      if (temp === item) {
        result.push(temp);
      }
    });
  });
  return unique(result);
}

/**
 * 获取url参数对象
 * @param {参数名称} name
 */
export function getUrlString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 重组属性值
 * @param {名} name
 * @param {读取值}} value
 * @param {多选}} multiple
 */
export function makeInitialValue(name, value, multiple = false) {
  if (!name) return value;
  let newValue = [];
  if (multiple) {
    newValue = value.map((item) => {
      const temp = {};
      Object.keys(name).forEach((key) => {
        if (item[key]) {
          temp[name[key]] = item[key];
        }
      });
      return temp;
    });
  } else {
    newValue = {};
    Object.keys(name).forEach((key) => {
      if (value[key]) {
        newValue[name[key]] = value[key];
      }
    });
  }
  return newValue;
}

/**
 *
 * @param {属性}} name
 * @param {值} value
 * @param {单选多选} multiple
 */
export function dontInitialValue(name, value, multiple = false) {
  if (!name) return value;
  let newValue;
  if (multiple) {
    newValue = [];
    value.forEach((item, i) => {
      newValue[i] = {};
      if (typeof name === 'object') {
        Object.keys(name).forEach((key) => {
          newValue[i][key] = item[name[key]];
        });
      } else {
        newValue[i] = item[name];
      }
    });
  } else if (!multiple) {
    if (typeof name === 'object') {
      newValue = {};
      Object.keys(name).forEach((key) => {
        newValue[key] = value[name[key]];
      });
    } else {
      newValue = value[name];
    }
  }
  return newValue;
}


/**
 * 屏幕高度，是否大屏
 */
export function getClientRatio() {
  const { height } = document.body.getBoundingClientRect();
  return {
    height,
    isBigRatio: height > 660,
  };
}
/**
 * 弹窗高度
 */
export function getModalToAndHeight() {
  const { height, isBigRatio } = getClientRatio();
  const style = {};
  const maxHeight = 600;
  const minTo = 30;
  if (isBigRatio) {
    style.height = maxHeight;
    style.top = (height - maxHeight) / 2;
  } else {
    style.height = height - (minTo * 2);
    style.top = minTo;
  }
  return style;
}
/**
 * 弹窗内容高度
 */
export function getModalBodyHeight() {
  const { height } = getModalToAndHeight();
  const modalTitleHeight = 40;
  const bodyHeight = height - modalTitleHeight;
  return bodyHeight;
}

/**
 * 弹窗内表格高度
 */
export function getTableBodyHeight(footerAble) {
  const modalBodyHeight = getModalBodyHeight();
  const tableHeader = 46;
  const tableeExtarHegiht = 60;
  const tablePaginatiopnBottom = 35;
  const footer = footerAble ? 50 : 0;
  return modalBodyHeight - (tableHeader + tableeExtarHegiht + tablePaginatiopnBottom + footer);
}

/**
 * 获取id的所有上级数据
 * @param {数据源} data
 * @param {查找的id} id
 */
export function findTreeParent(data, id, key = 'id', pid = 'parent_id') {
  const result = [];
  const findData = data.find((item) => {
    return item[key] === id;
  });
  if (!findData || !id) return result;
  result.push(findData);
  let perantItem = [];
  perantItem = findTreeParent(data, findData[pid], key, pid);
  return result.concat(perantItem);
}

/**
 * 容器容纳字数
 * @param {容器宽度} width
 * @param {字数} fontSize
 */
export function countViewFontSize(width, fontSize) {
  return Math.floor(width / fontSize);
}
/**
 * str 截取字符串
 * width 容器宽度
 * fontSize 字数
 */
export function getLetfEllipsis(str, width, fontSize) {
  const numberStr = countViewFontSize(width, fontSize);
  if (str.length < numberStr) return str;
  return `...${str.substr(-numberStr + 3)}`;
}
/**
 * 表单错误
 * @param {错误异常} temp
 * @param {是否生成错误} isUnicode
 */
export function unicodeFieldsError(temp, isUnicode = true, values) {
  const fieldsValue = { ...temp };
  const params = {};
  Object.keys(fieldsValue).forEach((key) => {
    const value = fieldsValue[key];
    let fieldsValueMd = params;
    const keyGroup = key.split('.');
    const newValues = dotFieldsValue(values);
    keyGroup.forEach((item, index) => {
      if (index === keyGroup.length - 1) {
        if (Object.hasOwnProperty.call(newValues, key)) {
          fieldsValueMd[item] = isUnicode ?
            { value: newValues[key], errors: [new Error(value[0])] } : value;
        } else {
          fieldsValueMd[item] = isUnicode ?
            { errors: [new Error(value[0])] } : value;
        }
      } else {
        fieldsValueMd[item] = fieldsValueMd[item] || {};
        fieldsValueMd = fieldsValueMd[item];
      }
    });
    if (Object.hasOwnProperty.call(newValues, key) && !Object.hasOwnProperty.call(params, key)) {
      params[key] = isUnicode ? { errors: [new Error(value[0])] } : value;
    }
  });
  return params;
}

/**
 * 反回store对象的props
 * @param {生成store的类} _this
 * @param {*参数类型} type
 */
export function makeProps(_this, type) {
  const response = { ..._this.props };
  const { loading } = _this.props;
  if (typeof type === 'string') {
    response.loading = loading[type];
    if (_this[type]) response[type] = _this[type];
  } else if (Array.isArray(type)) {
    response.loading = false;
    type.forEach((item) => {
      if (loading[item]) response.loading = true;
      if (_this[item]) response[item] = _this[item];
    });
  } else {
    response.loading = false;
    Object.keys(_this).forEach((item) => {
      const func = _this[item];
      if (typeof func === 'function') response[item] = func;
    });
    Object.keys(loading).forEach((load) => {
      const loadBeal = loading[load];
      if (loadBeal) response.loading = true;
    });
  }
  return response;
}


/**
 *  获取数据转换源
 * @param {数据源} dataSource
 * @param {转换数据} data
 * @param {返回的值的key} index
 */

export function getDataSourceIndex(dataSource, keyData, name = 'name', dataSourceIndex = 'id') {
  const key = (keyData || []).map(item => `${item}`);
  const value = (dataSource || []).filter(item => key.indexOf(`${item[dataSourceIndex]}`) !== -1);
  if (!name) {
    return value;
  }
  return value.map(item => item[name]);
}

/**
 *
 * @param {数据源} dataSource
 * @param {值} value
 * @param {显示文字} text
 */
export function getFiltersData(dataSource, value = 'id', text = 'name') {
  return (dataSource || []).map(item => ({ value: item[value], text: item[text] }));
}


/**
 *  解析单个键
 */
export function findRenderKey(dataSource, key = '', index = 'id') {
  return (dataSource || []).find(item => `${item[index]}` === `${key}`) || {};
}

/**
 *
 * @param {替换数据源} dataSource
 * @param {替换的数组} key
 * @param {替换数组的键默认id，可以是对象或者一维数组} index
 * @param {返回对象的key}   amen
 * @param {数据源的下标和替换数组作对比默认id} dataSourceIndex
 */
export function analysisData(dataSource, key, keyIndex, name, dataSourceIndex) {
  const keysValue = (key || [])
    .map(item => (keyIndex && item[keyIndex] !== undefined ? item[keyIndex] : item));
  return getDataSourceIndex(dataSource, keysValue, name, dataSourceIndex);
}


/**
 * 十六进制->rgb
 * @param {转换的字符串} str
 */
export function colorToRgb(str) {
  let sColor = str.toLowerCase();
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 处理六位的颜色值
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`, 16));
    }
    return `RGB(${sColorChange.join(',')})`;
  }
  return sColor;
}

/**
 *   rgb->十六进制
 * @param {转换的字符串} str
 */
export function colorToHex(str) {
  // 十六进制颜色值的正则表达式
  const that = str;
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(that)) {
    const aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    let strHex = '#';
    for (let i = 0; i < aColor.length; i += 1) {
      let hex = Number(aColor[i]).toString(16);
      if (hex.length < 2) {
        hex = `0${hex}`;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = that;
    }
    return strHex;
  } else if (reg.test(that)) {
    const aNum = that.replace(/#/, '').split('');
    if (aNum.length === 6) {
      return that;
    } else if (aNum.length === 3) {
      let numHex = '#';
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i]);
      }
      return numHex;
    }
  }
  return that;
}

export function base64ToBlob(dataurl, filename = 'fileImg.png') {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n -= 1) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


/**
 *  审核状态图片
 */

export function getStatusImg(status) {
  switch (status) {
    case 0:
      return '/checkin.png';
    case 1:
      return '/checkin.png';
    case 2:
      return '/pass.png';
    case -1:
      return '/reject.png';
    case -2:
      return '/rollback.png';
    case -3:
      return '/cancel.png';
    default:
  }
}
