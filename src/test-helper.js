/* eslint-disable import/prefer-default-export,no-undef */
import { useCouchbase, useCouchbaseMock, resetCouchbaseMock } from './index'

function useMockedCouchbaseInTests() {
  beforeEach(() => {
    resetCouchbaseMock()
    useCouchbaseMock()
  })

  afterEach(() => {
    resetCouchbaseMock()
    useCouchbase()
  })
}

export {
  useMockedCouchbaseInTests,
}
