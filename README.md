# redux-replay
Transport-agnostic Redux action persistence, retrieval, and replay.
Designed to work with [redux-logger](https://github.com/evgenyrodionov/redux-logger)'s [persistence](https://github.com/evgenyrodionov/redux-logger/pull/197) mechanism.

Ships with a basic Firebase transport. Feel free to roll your own.

### Note about `LogRetreaverFunc`
It is the responsiblity of the `logRetreaver` to limit access to data. If not properly implemented, it is possible that arbitrary users' sessions may be retrieved by providing a valid `sessionId`

### Goals
- test firebase transport
- figure out peer/optional dependency management
- update readme
- finish http transport
- add example
- replay progress indicator/logging - verbose flag?

### Longterm Goals
- localStorage transport and exmaple
- `combineTransports`
