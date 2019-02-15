import * as _ from 'lodash';

const jsonDiff = require('json-diff');

const CHANGE_PROPERTY_OLD_KEY     = '__old';
const CHANGE_PROPERTY_NEW_KEY     = '__new';
const DELETED_PROPERTY_KEY_SUFFIX = "__deleted";

export function difference(baseJSON: any, changedJSON: any) {
  const diff = getDifferenceJSON(jsonDiff.diff(baseJSON, changedJSON));
  return JSON.stringify(diff);
}

function getDifferenceJSON(diff: any, keys: string[] = [], jsonDifference: any = {}) {
  let newDiff = {};
  if(_.has(diff, CHANGE_PROPERTY_OLD_KEY)){
    newDiff  = getNewDiff(diff, keys);
    jsonDifference = _.merge(jsonDifference, newDiff);
  }else if(typeof diff === 'object' && diff !== null){
    for(let key in diff){
      if(_.endsWith(key, DELETED_PROPERTY_KEY_SUFFIX)){
        key = diff[key];
      }

      keys.push(key);
      if(typeof diff[key] === 'object' && diff[key] != null){
        jsonDifference = getDifferenceJSON(diff[key], keys, jsonDifference);
      }else{
        newDiff = getNewDiff(diff, keys);
        jsonDifference = _.merge(jsonDifference, newDiff);
      }
    }
  }

  return jsonDifference;
}

function getNewDiff(json: any, keys: string[]) {
  const originalKeysLength = keys.length;
  let newDiff = {}, temp = {};
  for(let i = originalKeysLength - 1; i >= 0; i--){
    const key = keys[ i ];
    if (i === originalKeysLength - 1) {
      newDiff[ key ] = json[CHANGE_PROPERTY_NEW_KEY] || null;
      keys.pop(); // pop out the tracked key after its value is retrieved.
    } else {
      temp[ key ] = newDiff;
      newDiff     = temp;
      temp        = {};
    }
  }

  return newDiff;
}

const baseJson = {
  "test": {
    "const": "const",
    "hello": "this is a test",
    "test": {
      "hello":"there it is",
    }
  },
};

const changedJson = {
  "test":{
    "hello": "this is not a test",
    "test": {
      "hello":"there it is. Isnt it?",
    }
  }
};

difference(baseJson, changedJson);

