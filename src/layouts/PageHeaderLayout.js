import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../components/PageHeader';
import { getMenuData } from '../common/menu';
import styles from './PageHeaderLayout.less';


function getNavMenuItems(menusData, data) {
  menusData.forEach((item) => {
    const temp = {
      ...item,
      path: item.path !== '/' ? `/${item.path}` : '/',
    };
    delete temp.children;
    data.push(temp);
    if (item.children) {
      getNavMenuItems(item.children, data);
    }
  });
}


const data = [];
getNavMenuItems(getMenuData(), data);
export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} menuData={data} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
