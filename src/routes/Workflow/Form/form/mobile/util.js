/**
 * Created by sushaochun on 2018/12/28.
 */
export function compare(property) {
  return function (a, b) {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
}

export function handleSort(data, fieldsData, gridsData) {
  const list = makeTagarray(fieldsData, gridsData);
  list.splice(data.mobile_y, 0, data);
  for (let item = 0; item < list.length; item += 1) { // 删除操作
    if (list[item].key === data.key && list[item].mobile_y !== data.mobile_y) {
      list.splice(item, 1);
    }
  }
  for (let item = 0; item < list.length; item += 1) { // 重排序操作
    list[item].mobile_y = item;
  }
  for (let item = 0; item < [...fieldsData, ...gridsData].length; item += 1) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].key === [...fieldsData, ...gridsData][item].key) {
        if ('fields' in list[i]) {
          gridsData.splice(gridsData.indexOf([...fieldsData, ...gridsData][item]), 1, list[i]);
        } else {
          fieldsData.splice(fieldsData.indexOf([...fieldsData, ...gridsData][item]), 1, list[i]);
        }
      }
    }
  }
  const MaxLine = 0;
  return { fieldsData, gridsData, MaxLine };
}

export function handleChildsort(data, gridsData, parentGridIndex) {
  // 获取grids.fields
  const field = typeof parentGridIndex === 'number' ? gridsData[parentGridIndex].fields : parentGridIndex.fields;
  const list = makeTagarray(field);
  list.splice(data.mobile_y, 0, data);
  for (let item = 0; item < list.length; item += 1) { // 删除操作
    if (list[item].key === data.key && list[item].mobile_y !== data.mobile_y) {
      list.splice(item, 1);
    }
  }
  for (let item = 0; item < list.length; item += 1) { // 重排序操作
    list[item].mobile_y = item;
  }
  for (let item = 0; item < field.length; item += 1) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].key === field[item].key) {
        field[item].mobile_y = list[i].mobile_y;
      }
    }
  }
  const MaxLine = 0;
  return { gridsData, MaxLine };
}

export function setFilds(fields, grids, form) {
  const options = {};
  for (let i = 0; i < grids.length; i += 1) {
    options[`grids.${i}.mobile_y`] = grids[i].mobile_y;
    options[`grids.${i}.fields`] = grids[i].fields || [];
    // options[`grids.${i}.tagposition`] = grids[i].tagposition;
  }
  form.setFieldsValue({ fields, ...options });
}

export function getTagpotision(selector, x, y) { // x，y坐标
  const boardTag = document.querySelectorAll(selector);
  let domRect = null;
  for (let tag = 0; tag < boardTag.length; tag += 1) {
    domRect = boardTag[tag].getBoundingClientRect();
    if (y > domRect.top && y < domRect.bottom) {
      return {
        y: domRect.top,
        x: domRect.left,
        index: boardTag[tag].getAttribute('index'),
        height: boardTag[tag].getAttribute('height'),
      };
    }
    if (tag === boardTag.length - 1 && y > domRect.bottom) {
      return null;
    }
  }
  return undefined;
}

export function makeTagarray(fields = [], grids = []) {
  const initArray = [];
  [...fields, ...grids].filter(item => typeof item.mobile_y === 'number')
    .sort(compare('mobile_y')).map((item) => {
      return initArray.push(item);
    });
  return initArray;
}

