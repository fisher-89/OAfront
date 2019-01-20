/**
 * Created by sushaochun on 2018/12/28.
 */
export function compare(property){
  return function(a,b){
    let value1 = a[property];
    let value2 = b[property];
    return value1 - value2;
  }
}

export function handleSort (data,fields,grids){
  let list = makeTagarray(fields,grids);
  list.splice(data.mobile_y,0,data);
  for(let item in list){//删除操作
    if(list[item].key===data.key && list[item].mobile_y !==data.mobile_y){
      list.splice(item,1);
    }
  }
  for(let item in list){//重排序操作
    list[item].mobile_y = item;
  }
  for(let item=0; item<[...fields,...grids].length;item++) {
    for (let i in list) {
      if (list[i].key === [...fields, ...grids][item].key) {
        if ("fields" in list[i]) {
          grids.splice(grids.indexOf([...fields, ...grids][item]), 1, list[i])
        } else {
          fields.splice(fields.indexOf([...fields, ...grids][item]), 1, list[i])
        }
      }
    }
  }
  const MaxLine = 0;
  return {fields,grids,MaxLine}
}

export function handleChildsort(data,grids,parentGridIndex){
    //获取grids.fields
    const field = typeof parentGridIndex ==='number'?grids[parentGridIndex].fields:parentGridIndex.fields;
    let list = makeTagarray(field);
    list.splice(data.mobile_y,0,data);
    for(let item in list){//删除操作
      if(list[item].key===data.key && list[item].mobile_y !==data.mobile_y ){
        list.splice(item,1);
      }
    }
    for(let item in list){//重排序操作
      list[item].mobile_y = item;
    }
    for(let item=0; item<field.length;item++) {
      for (let i in list) {
        if (list[i].key === field[item].key) {
          field[item].mobile_y = list[i].mobile_y
        }
      }
    }
  const MaxLine = 0;
  return {grids,MaxLine}
}

export function  setFilds(fields,grids,form){
  let options = {};
  for(let i=0;i<grids.length;i+=1){
    options[`grids.${i}.mobile_x`] = grids[i].mobile_x;
    options[`grids.${i}.mobile_y`] = grids[i].mobile_y;
    options[`grids.${i}.fields`] = grids[i].fields || [];
    // options[`grids.${i}.tagposition`] = grids[i].tagposition;

  }
  form.setFieldsValue({fields,...options})
}

export function  getTagpotision(selector,x,y){ //x，y坐标
    const boardTag =  document.querySelectorAll(selector);
    let domRect = void 666;
    for(let tag=0;tag<boardTag.length;tag++){
      domRect = boardTag[tag].getBoundingClientRect();
      if(y>domRect.top && y<domRect.bottom){
         return {
            y:domRect.top,
            x:domRect.left,
            index:boardTag[tag].getAttribute("index"),
            height:boardTag[tag].getAttribute("height")
          }
      }
      if(tag===boardTag.length-1 && y>domRect.bottom){
        return null;
      }
    }
    return void 888;
}

export function  makeTagarray(fields=[],grids=[]){
  let initArray =[];
  [...fields,...grids].filter(item=>item.mobile_y && item.mobile_y!==null).sort(compare("mobile_y")).map(item=>{
     initArray.push(item)
  });
  return initArray;
}

