import { difference } from '../difference';
const expect = require('chai').expect;

describe('Merge translation requests', () => {
  let base = {};
  before(() => {
    base = {
      "test": {
        "const": "const",
        "hello": "this is a test",
        "test": {
          "hello":"there it is",
        }
      },
    };
  });

  it('should return the difference in changed JSON from the base JSON while preserving the property hierarchy', () => {

    const changed = {
      "test":{
        "const": "const",
        "hello": "this is not a test",
        "test": {
          "hello":"there it is. Isnt it?",
        }
      }
    };

    const expected = {
      'test': {
        'hello': 'this is not a test',
        'test' : {
          'hello': 'there it is. Isnt it?'
        },
      },
    };
    const diff = difference(base, changed);

    expect(diff).to.be.eql(expected, 'The difference is not correct');
  });

  it('should return a null value if the change is removal of the property from the base JSON', ()=>{
    const changed = {
      "test":{
        "hello": "this is not a test",
        "test": {
          "hello":"there it is. Isnt it?",
        }
      }
    };

    const diff:any = difference(base, changed);

    expect(diff.test.const).to.be.null;
  });
});