/**
 * Created by Administrator on 2018/4/1.
 */
import { notification } from 'antd';

export default {
  save(state, action) {
    const { store, id, data } = action.payload;
    if (id === undefined) {
      return {
        ...state,
        [store]: data,
      };
    } else {
      const originalStore = state[`${store}Details`];
      return {
        ...state,
        [`${store}Details`]: {
          ...originalStore,
          [id]: data,
        },
      };
    }
  },
  add(state, action) {
    const { store, data, message } = action.payload;
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return state;
    }
    notification.success({
      message: message || '添加成功',
    });
    let dataState = state[store];
    if (Array.isArray(state[store])) {
      dataState = [...state[store]];
      dataState.push(data);
    } else if (state[store].data) {
      dataState = { ...state[store] };
      dataState.data = [...state[store].data];
      dataState.data.push(data);
      dataState.total = state[store].total + 1;
    }
    return {
      ...state,
      [store]: dataState,
    };
  },
  multiupdate(state, action) {
    const { store, data, message } = action.payload;
    // console.log(state, 'state');
    // console.log(action, 'action');
    // console.log(data, 'data');
    // console.log(store, 'store');
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return { ...state };
    }
    notification.success({
      message: message || '编辑成功',
    });
    const updata = { ...data };
    const dataSource = Array.isArray(state[store]) ? state[store] : (state[store].data || []);
    const midStore = dataSource;
    let index;
    Object.keys(updata).forEach((key) => {
      console.log(updata[key], 'updata');
      index = 0;
      midStore.map((item) => {
        if (parseInt(item.id, 0) === parseInt(updata[key].id, 0)) {
          midStore.splice(index, 1);
          index += 1;
          midStore.push(updata[key]);
          return null;
        } else {
          index += 1;
          return null;
        }
      });
    });
    console.log(midStore);
    let dataState;
    if (Array.isArray(state[store])) {
      dataState = state[store] ? [...midStore] : [];
    } else {
      dataState = state[store].data ? {
        ...state[store],
        data: midStore,
      } : {};
    }
    console.log(dataState, 'dataState');
    return {
      ...state,
      [store]: dataState,
    };
  },
  update(state, action) {
    const { store, id, data, message } = action.payload;
    console.log(state, 'state');
    console.log(action, 'action');
    console.log(store, 'store');
    console.log(id, 'id');
    console.log(data, 'data');
    console.log(message, 'message');
    console.log(data.message, 'data.message');
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return { ...state };
    }
    notification.success({
      message: message || '编辑成功',
    });
    const originalStore = { ...state[`${store}Details`] }; console.log(originalStore, 'originalStore');
    Object.keys(originalStore).forEach((key) => {
      if (`${id}` === `${key}`) {
        originalStore[key] = data;
      }
    });

    const dataSource = Array.isArray(state[store]) ? state[store] : (state[store].data || []);
    console.log(dataSource, 'dataSource');
    let updated = false;
    const newStore = dataSource.map((item) => {
      if (parseInt(item.id, 0) === parseInt(id, 0)) {
        updated = true;
        return data;
      } else {
        return item;
      }
    });
    console.log(newStore, 'newStore');
    if (!updated) {
      newStore.push(data);
    }
    let dataState;
    if (Array.isArray(state[store])) {
      dataState = state[store] ? [...newStore] : [];
    } else {
      dataState = state[store].data ? {
        ...state[store],
        data: newStore,
      } : {};
    }
    console.log(dataState, 'dataState');
    return {
      ...state,
      [store]: dataState,
      [`${store}Details`]: originalStore,
    };
  },
  delete(state, action) {
    const { store, id, data = [], message } = action.payload;
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return { ...state };
    }
    notification.success({
      message: message || '删除成功',
    });
    const originalStore = { ...state[`${store}Details`] };
    Object.keys(originalStore).forEach((key) => {
      if (id === key) {
        delete originalStore[key];
      }
    });

    const dataState = Array.isArray(state[store]) ? (
      state[store] ? state[store].filter(item => item.id !== id) : []
    ) :
      (
        state[store].data ? {
          ...state[store],
          total: state[store].total - 1,
          data: state[store].data.filter(item => item.id !== id),
        } : {}
      );
    return {
      ...state,
      [store]: dataState,
      [`${store}Details`]: originalStore,
    };
  },
  exportExcel(state, action) {
    const { data, filename, message } = action.payload;
    data.blob().then((body) => {
      const blob = new Blob([body]);
      const newFilename = filename || 'excel.xls';
      if ('download' in document.createElement('a')) {
        const downloadElement = document.createElement('a');
        let href = '';
        if (window.URL) href = window.URL.createObjectURL(blob);
        else href = window.webkitURL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = newFilename;
        downloadElement.click();
        if (window.URL) window.URL.revokeObjectURL(href);
        else window.webkitURL.revokeObjectURL(href);
        notification.success({
          message: message || '导出成功',
        });
      }
    });
    return state;
  },
};
