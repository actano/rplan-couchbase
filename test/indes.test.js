import { expect } from 'chai'
import couchbase from 'couchbase'

import { bucket } from '../src/index'
import { useMockedCouchbaseInTests } from '../src/test-helper'

describe('couchbase wrapper', () => {
  useMockedCouchbaseInTests()

  after(() => {
    bucket().disconnect()
  })

  it('should get a value', async () => {
    await bucket().insert('a', { foo: 1 })
    const result = await bucket().get('a')

    expect(result.value).to.deep.equal({ foo: 1 })
  })

  it('should get multiple values', async () => {
    await bucket().insert('a', { foo: 1 })
    await bucket().insert('b', { bar: 1 })
    const result = await bucket().getMulti(['a', 'b'])

    expect(result.a.value).to.deep.equal({ foo: 1 })
    expect(result.b.value).to.deep.equal({ bar: 1 })
  })

  it('should insert a value', async () => {
    await bucket().insert('a', { foo: 1 })
    const result = await bucket().get('a')

    expect(result.value).to.deep.equal({ foo: 1 })
  })

  it('should upsert a value', async () => {
    await bucket().upsert('a', { foo: 1 })
    const result = await bucket().get('a')

    expect(result.value).to.deep.equal({ foo: 1 })
  })

  it('should replace a value', async () => {
    await bucket().insert('a', { foo: 1 })
    await bucket().replace('a', { bar: 1 })
    const result = await bucket().get('a')

    expect(result.value).to.deep.equal({ bar: 1 })
  })

  it('should remove a value', async () => {
    await bucket().insert('a', { foo: 1 })
    await bucket().remove('a')
    const result = await bucket().find('a')

    expect(result).to.equal(null)
  })

  it('should find a value', async () => {
    await bucket().insert('a', { foo: 1 })
    const result = await bucket().find('a')

    expect(result.value).to.deep.equal({ foo: 1 })
  })

  it('should not find a non existing value', async () => {
    const result = await bucket().find('a')

    expect(result).to.equal(null)
  })

  it('should find multiple values', async () => {
    await bucket().insert('a', { foo: 1 })
    const result = await bucket().findMulti(['a', 'b'])

    expect(result.a.value).to.deep.equal({ foo: 1 })
    expect(result.b.error.code).to.equal(couchbase.errors.keyNotFound)
  })
})
