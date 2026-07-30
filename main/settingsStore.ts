import ElectronStore from 'electron-store'

export interface Settings {
  anthropicApiKey: string
  model: string
  slackWebhookUrl: string
  lineChannelAccessToken: string
  lineTargetId: string
  githubToken: string
}

export const settingsStore = new ElectronStore<Settings>({
  name: 'settings',
  defaults: {
    anthropicApiKey: '',
    model: 'claude-sonnet-4-6',
    slackWebhookUrl: '',
    lineChannelAccessToken: '',
    lineTargetId: '',
    githubToken: '',
  },
})
