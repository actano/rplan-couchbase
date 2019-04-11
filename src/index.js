import couchbase from 'couchbase'
import config from '@rplan/config'
import { promisify } from 'util'

const host = config.get('couchbase:host')
const port = config.get('couchbase:port')
const bucketName = config.get('couchbase:bucket_name')

let useMock = false

const findMulti = _bucket => ids =>
  new Promise((resolve, reject) => {
    _bucket.getMulti(ids, (err, results) => {
      const unexpectedErrorKey = Object.keys(results).find(key =>
        results[key].error && results[key].error.code !== couchbase.errors.keyNotFound)

      if (results[unexpectedErrorKey]) {
        reject(results[unexpectedErrorKey].error)
      } else {
        resolve(results)
      }
    })
  })

const isHealthy = _bucket => async () => {
  try {
    await _bucket.ping([couchbase.ServiceType.KeyValue])
  } catch (e) {
    return false
  }
  return true
}

const find = _bucket => async (entityId) => {
  try {
    return await _bucket.get(entityId)
  } catch (e) {
    if (e.code === couchbase.errors.keyNotFound) {
      return null
    }
    throw e
  }
}

function getMockedBucket() {
  const cluster = new couchbase.Mock.Cluster()
  return cluster.openBucket()
}

function getCouchbaseBucket() {
  const cluster = new couchbase.Cluster(`couchbase://${host}:${port}/`)
  return cluster.openBucket(bucketName)
}

const promisifyBucketFn = (_bucket, fn) => promisify(_bucket[fn]).bind(_bucket)
const promisifyBucket = (_bucket) => {
  const promisifiedBucket = {
    upsert: promisifyBucketFn(_bucket, 'upsert'),
    insert: promisifyBucketFn(_bucket, 'insert'),
    replace: promisifyBucketFn(_bucket, 'replace'),
    get: promisifyBucketFn(_bucket, 'get'),
    getMulti: promisifyBucketFn(_bucket, 'getMulti'),
    remove: promisifyBucketFn(_bucket, 'remove'),
    query: promisifyBucketFn(_bucket, 'query'),
    disconnect: _bucket.disconnect.bind(_bucket),
  }

  if (_bucket.ping) {
    promisifiedBucket.ping = promisifyBucketFn(_bucket, 'ping')
    promisifiedBucket.isHealthy = isHealthy(promisifiedBucket)
  } else {
    promisifiedBucket.ping = () => true
    promisifiedBucket.isHealthy = () => true
  }
  promisifiedBucket.find = find(promisifiedBucket)
  promisifiedBucket.findMulti = findMulti(promisifiedBucket)

  return promisifiedBucket
}

let mockedBucket
function resetCouchbaseMock() {
  mockedBucket = promisifyBucket(getMockedBucket())
}

let couchbaseBucket
function bucket() {
  if (!couchbaseBucket) {
    couchbaseBucket = promisifyBucket(getCouchbaseBucket())
    resetCouchbaseMock()
  }

  return useMock ? mockedBucket : couchbaseBucket
}

function useCouchbaseMock() {
  useMock = true
}

function useCouchbase() {
  useMock = false
}

export {
  bucket,
  useCouchbase,
  useCouchbaseMock,
  resetCouchbaseMock,
}
