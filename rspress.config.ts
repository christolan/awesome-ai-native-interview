import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: '.',
  title: 'AI Native 面试题库',
  description: '面向 AI Native 工程师的面试训练与核心概念归档',
  outDir: 'doc_build',
  route: {
    extensions: ['.md', '.mdx'],
    exclude: ['AGENTS.md', 'node_modules/**', 'doc_build/**'],
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/christolan/awesome-ai-native-interview',
      },
    ],
  },
});
