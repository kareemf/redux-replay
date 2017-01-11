# redux-replay

### Note about `LogRetreaverFunc`
It is the responsiblity of the `logRetreaver` to limit access to data. If not properly implemented, it is possible that arbitrary users' sessions may be retrieved by providing a valid `sessionId`

### Goals
- redux-logger: `persistencePredicate` - defaults to `predicate - allows entry to be logged without persisting, vice versa
- `replayedActionTransformer` - attach `__replayed` to replayed actions by default
- test firebase transport
- figure out peer/optional dependency management
- update readme
- finish http transport
- add example
- replay progress indicator/logging - verbose flag?

### Longterm Goals
- localStorage transport and exmaple
- `combineTransports`
