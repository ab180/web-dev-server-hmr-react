# web-dev-server-hmr-react

## Description

`web-dev-server-hmr-react` is plugin on `web-dev-server` to implement HMR for react.

## How use

```typescript
import { startDevServer } from '@web/dev-server'
import { hmrReact } from 'web-dev-server-hmr-react'

(async () => {
    await startDevServer({
        config: {
            open: true,
            plugins: [
                ...await hmrReact(),
            ],
        },
    })
})()
```