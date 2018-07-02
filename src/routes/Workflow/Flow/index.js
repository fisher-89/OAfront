import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import { Card } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';
import IndexComponent from './list';

export default class Form extends PureComponent {
  render() {
    const { match, routerData } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
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
            <IndexComponent />
          </Switch>
        </Card>
      </PageHeaderLayout>
    );
  }
}
