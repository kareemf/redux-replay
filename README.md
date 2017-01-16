# redux-replay
Transport-agnostic Redux action persistence, retrieval, and replay.
Designed to work with [redux-logger](https://github.com/evgenyrodionov/redux-logger)'s [persistence](https://github.com/evgenyrodionov/redux-logger/pull/197) mechanism.

Ships with a basic Firebase transport. Feel free to roll your own.

### Not undo/redo
Whereas undo/redo relies on higher-order reducers to update state with no notion of persistence, this library is focused on persisting all actions, and allowing them to be fetched and replayed later.

### Note about `LogRetreaverFunc`
It is the responsiblity of the `logRetreaver` to limit access to data. If not properly implemented, it is possible that arbitrary users' sessions may be retrieved by providing a valid `sessionId`

### Note about `peerDependencies`
This package follows the strategy outlined in
[Dealing with the deprecation of peerDependencies in NPM 3](https://codingwithspike.wordpress.com/2016/01/21/dealing-with-the-deprecation-of-peerdependencies-in-npm-3/)
of duplicating `peerDependencies` in `dependencies`. This achieves the effect of supporting both NPM 3 and NPM 2 as well as allowing for smoother devlopement workflow, i.e. not having to manually install `peerDependencies`.

### Goals
- test firebase transport
- update readme
- finish http transport
- add example
- replay progress indicator/logging - verbose flag?

### Longterm Goals
- localStorage transport and exmaple
- `combineTransports`
