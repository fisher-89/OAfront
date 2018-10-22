import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import { Card } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';
import ListComponent from './list';

export default class Form extends PureComponent {
  render() {
    const { match, routerData, location: { pathname } } = this.props;
    const style = { backgroundColor: 'transparent' };
    const infoPath = pathname.indexOf('/client/customer/list/info/') > -1;
    return (
      <PageHeaderLayout>
        <Card bordered={false} {...(infoPath && { style })}>
          <Switch>
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))
            }
            <ListComponent {...this.props} />
          </Switch>
        </Card>
      </PageHeaderLayout>
    );
  }
}
