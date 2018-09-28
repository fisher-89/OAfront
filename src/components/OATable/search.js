import React, { PureComponent } from 'react';

export default (SearchComponent) => {
  return class NewSearchComponent extends PureComponent {
    state = {
      formFilter: {},
    }

    makeNewSearchProps = () => {
      return {
        search: this.moreSearch,
        ...this.props,
      };
    }

    moreSearch = (formFilter) => {
      const newFilter = this.props.defaultFilter;
      this.setState({ formFilter }, () => {
        this.props.fetchDataSource(newFilter);
        this.props.handleVisibleChange(false);
      });
    };

    render() {
      return <SearchComponent {...this.makeNewSearchProps()} />;
    }
  };
};
