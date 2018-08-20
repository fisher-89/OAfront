import React from 'react';

export default formCreate => option => (Component) => {
  const FormComponent = (props) => {
    const { bindForm, form } = props;
    bindForm(form);
    return <Component {...props} />;
  };
  return formCreate(option)(FormComponent);
};
