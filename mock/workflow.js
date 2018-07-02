// mock formTypeDataSource
const formTypeDataSource = [];
for (let i = 0; i < 46; i += 1) {
  formTypeDataSource.push({
    id: i,
    name: `分类${i}`,
    sort: i,
    created_at: '2017-10-30 12:00:00',
    updated_at: new Date(),
  });
}

export function getFormType(req, res) {
  const { sorter, filters, searchers } = req.body;

  let dataSource = [...formTypeDataSource];

  if (sorter) {
    const s = sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (filters) {
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        dataSource = dataSource.filter((data) => {
          return filters[key].indexOf(`${data[key]}`) !== -1;
        });
      }
    });
  }

  if (searchers) {
    Object.keys(searchers).forEach((key) => {
      const value = searchers[key];
      if (value.length > 0) {
        dataSource = dataSource.filter((data) => {
          const reg = new RegExp(value, 'gi');
          const match = `${data[key]}`.match(reg);
          return match;
        });
      }
    });
  }

  const result = dataSource;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function formTypeSave(req, res) {

}

export default {
  getFormType,
  formTypeSave,
};
