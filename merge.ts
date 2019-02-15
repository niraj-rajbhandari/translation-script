import * as _ from 'lodash';

export function merge(base: any, source: any, partial?: any) {
  if (partial) {
    source = getValuesForKeys(source, partial);
  }

  return JSON.stringify(_.merge(base, source));
}

function getValuesForKeys(changedJSON: any, changedKeys: any, keyList: string[] = [], allChanges = {}): any {
  for (const key in changedKeys) {
    keyList.push(key);
    if (changedKeys[key] && typeof changedKeys[ key ] === 'object') {
      allChanges = _.merge(allChanges, getValuesForKeys(changedJSON, changedKeys[ key ], keyList, allChanges));
    } else {
      let newChanges = {}, temp = {};
      const originalKeyListLength = keyList.length;
      for (let i = originalKeyListLength - 1; i >= 0; i--) {
        const key = keyList[ i ];
        if (i === originalKeyListLength - 1) {
          const nestedValue = getNestedValue(changedJSON, keyList);
          newChanges[ key ] = nestedValue;
          keyList.pop(); // pop out the tracked key after its value is retrieved.
        } else {
          temp[ key ] = newChanges;
          newChanges  = temp;
          temp        = {};
        }
      }
      allChanges = _.merge(allChanges, newChanges); //deep merge
    }
  }
  return allChanges;
}

export function getNestedValue(jsonObject: any, keyList: string[]): any {
  if (!_.isEmpty(keyList)) {
    const value = jsonObject[ keyList[ 0 ] ];
    if (value) {
      const keys = keyList.slice(1);
      if (typeof value === 'object' && !_.isEmpty(keys)) {
        return getNestedValue(value, keys);
      } else {
        return value;
      }
    }
  }
  return null;
}

// the diff between dev and feature branch
const given = {
  "How": 'test',
  "Yellow":"add",
  'hello': {
    'How': ' here',
    'yes': {
      'go': 'to hell',
      'uhuh': {
        'foo': 'bar'
      }
    },
  },
};

// the merged json from first script after translation
const changed = {
  'Hi'   : 'hi',
  'How'  : 'There',
  'hello': {
    'yes': {
      'go': 'to heaven',
    },
  },
};

const expected = {
  'How': 'there',
  'Yellow': null,
  'hello': {
    'yes': {
      'How': null,
      'go': 'to heaven'
    }
  }
};

// console.log(getNestedValue(changed,['How']));
console.log(JSON.stringify(getValuesForKeys(changed, given)));

let yes = {
  'hello':{
    'how':'there'
  }
};
let yes_again = {
  'hello':{
    'yes':{
      'go':'go to heaven'
    }
  }
};

// console.log(JSON.stringify({...yes, ...yes_again}));
// console.log(JSON.stringify(_.merge(yes,yes_again)));