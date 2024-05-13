Adapted from [@xstate/store](https://github.com/statelyai/xstate/tree/main/packages/xstate-store), MIT License, Copyright (c) 2015 David Khourshid

- Added a second argument `event` to `subscribe`, which is the send event that triggered this state change.
- Removed React-specific code (`useSelector`), XState-specific code (`fromStore`) and `createStoreWithProducer`.

Read the original docs [here](https://stately.ai/docs/xstate-store).
