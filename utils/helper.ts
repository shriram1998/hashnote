import { Node } from 'slate'

export const serialize = nodes => {
  return nodes.map(n => Node.string(n)).join('\n')
}
export function isSubset(array1:Array<any>, array2:Array<any>):Boolean {
  return array2.every(function (element) {
    return array1.includes(element);
  });
}

export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function objectCompare( a:Object, b:Object ,key:(string | number)) {
  if ( a[key] < b[key]){
    return 1;
  }
  if ( a[key] > b[key] ){
    return -1;
  }
  return 0;
}
export const rateLimit = require("lambda-rate-limiter")({
  interval: 1 * 1000 //Req per unit mentioned here is the threshold
}).check;

export const debounce = (func, delay=500) => {
    let timer;
    return function() {
      let self = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(self, args)
      }, delay)
    }
  }