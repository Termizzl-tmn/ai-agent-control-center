import ElectronStore from 'electron-store'

export interface Settings {
  anthropicApiKey: string
  model: string
}

export const settingsStore = new ElectronStore<Settings>({
  name: 'settings',
  defaults: { anthropicApiKey: '', model: 'claude-sonnet-4-6' },
})
