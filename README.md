@rplan/couchbase
================

# Introduction

This a simple couchbase wrapper that provides:

- a couchbase bucket configuration through @rplan/config
- a bucket with following methods promisified
   - `get`
   - `getMulti`
   - `upsert`
   - `insert`
   - `replace`
   - `remove`
   - `query`
   - `ping`
   - `disconnect`
- implements `find` that behaves like a `get`, 
   but returns null if key is not found 
- implements `findMulti` that is a `getMulti`, 
   but returns an error object for each key that is not found
- implements `isHealthy`, that pings the configured bucket
- implements a mocha test-helper `useMockedCouchbaseInTests` that points
   the couchbase to a `couchbase.Mock` instance during runtime    
   
   
# Usage

```javascript 1.8
import { bucket } from '@rplan/couchbase'

async function foo() {
  await bucket().insert('foo', { bar: true })
  const foo = await bucket().get('foo') // { value: { bar: true } }
}

```   
