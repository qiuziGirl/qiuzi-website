module.exports = {
  base: '/',
  title: '前端历险记',
  description: '秋子小朋友写的前端总结',
  head: [
    [ 'link', { rel: 'icon', href: '/favicon.png' }]
  ],
  themeConfig: {
    locales: {
      '/': {
        lastUpdated: '上次更新',
        nav: [
          { 
            text: '指南', 
            items: [
              { text: '前端基础', link: '/front-end/' },
              { text: '计算机基础', link: '/cs/' },
            ]
          },
          { text: '博文', link: 'https://blog.csdn.net/qq_41548644' },
          { text: '关于我', link: '/about/'},
        ],
        sidebar: {
          '/front-end/': getFrontEndSidebar('前端基础', '介绍'),
          '/cs/': getCSSidebar('计算机基础', '介绍')
        }
      }
    }
  }
}

function getFrontEndSidebar (groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['', introductionA],
        'js',
        'browser',
        'performance',
        'safety',
        'vue',
        'react',
      ]
    }
  ]
}

function getCSSidebar (groupB, introductionB) {
  return [
    {
      title: groupB,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['', introductionB],
        'network',
        'dataStruct',
        'algorithm'
      ]
    }
  ]
}
