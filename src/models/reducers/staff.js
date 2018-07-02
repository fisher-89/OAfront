/**
 * Created by Administrator on 2018/4/1.
 */
import { notification } from 'antd';

export default {
  save(state, action) {
    const { store, data } = action.payload;

    const { staffSn } = action.payload;
    if (staffSn === undefined) {
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
          [`${staffSn}`]: data,
        },
      };
    }
  },
  setTotal(state, action) {
    const { total } = action.payload;
    return {
      ...state,
      total,
    };
  },
  combine(state, action) {
    const { store, data } = action.payload;
    const originalStore = state[store];
    const newStore = originalStore;
    const originalKey = originalStore.map(item => item.staff_sn);
    data.forEach((item) => {
      const index = originalKey.indexOf(item.staff_sn);
      if (index === -1) {
        newStore.push(item);
      } else {
        newStore[index] = item;
      }
    });
    return {
      ...state,
      [store]: newStore,
    };
  },
  add(state, action) {
    const { store, data } = action.payload;
    notification.success({
      message: '添加成功',
    });
    state[store].push(data);
    return {
      ...state,
    };
  },
  update(state, action) {
    const { store, data } = action.payload;
    const staffSn = action.payload.staff_sn;

    let updated = false;
    const newStore = state[store].map((item) => {
      if (parseInt(item.staff_sn, 0) === parseInt(staffSn, 0)) {
        updated = true;
        return data;
      } else {
        return item;
      }
    });
    if (!updated) {
      newStore.push(data);
    }
    notification.success({
      message: '编辑成功',
    });
    return {
      ...state,
      [store]: newStore,
    };
  },
  delete(state, action) {
    const { store } = action.payload;
    const staffSn = action.payload.staff_sn;
    notification.success({
      message: '删除成功',
    });
    return {
      ...state,
      [store]: state[store].filter(item => item.staff_sn !== staffSn),
    };
  },
};
