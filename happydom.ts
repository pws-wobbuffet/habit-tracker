import { GlobalRegistrator } from '@happy-dom/global-registrator'

// Registers window/document/etc. globally so @testing-library/react can render
// components under `bun test`.
GlobalRegistrator.register()
