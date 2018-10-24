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
    const { store, data } = action.payload;
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return state;
    }
    notification.success({
      message: '添加成功',
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
  update(state, action) {
    const { store, id, data } = action.payload;
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return { ...state };
    }
    notification.success({
      message: '编辑成功',
    });
    const originalStore = { ...state[`${store}Details`] };
    Object.keys(originalStore).forEach((key) => {
      if (id === key) {
        delete originalStore[key];
      }
    });

    const dataSource = Array.isArray(state[store]) ? state[store] : (state[store].data || []);

    let updated = false;
    const newStore = dataSource.map((item) => {
      if (parseInt(item.id, 0) === parseInt(id, 0)) {
        updated = true;
        return data;
      } else {
        return item;
      }
    });
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
    return {
      ...state,
      [store]: dataState,
      [`${store}Details`]: originalStore,
    };
  },
  delete(state, action) {
    const { store, id, data = [] } = action.payload;
    if (data.message) {
      notification.error({
        message: data.message,
      });
      return { ...state };
    }
    notification.success({
      message: '删除成功',
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
  exportExcel(_, action) {
    const { data, filename } = action.payload;
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
      }
    });
  },
};
