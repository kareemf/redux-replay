# redux-replay

### Note about `LogRetreaverFunc`
It is the responsiblity of the `logRetreaver` to limit access to data. If not properly implemented, it is possible that arbitrary users' sessions may be retrieved by providing a valid `sessionId`

### Goals
- test firebase transport
- figure out peer/optional dependency management
- update readme
- finish http transport
- add example
- replay progress indicator

### Longterm Goals
- localStorage transport and exmaple
- `combineTransports`
