import { useCouchbase, useCouchbaseMock, resetCouchbaseMock } from './index'

function useMockedCouchbaseInTests() {
  // eslint-disable-next-line no-undef
  beforeEach(() => {
    resetCouchbaseMock()
    useCouchbaseMock()
  })

  // eslint-disable-next-line no-undef
  afterEach(() => {
    resetCouchbaseMock()
    useCouchbase()
  })
}

export {
  useMockedCouchbaseInTests,
}
