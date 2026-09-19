import nebulaDashboardImage from '../assets/projects/nebula-dashboard.svg'
import orbitNotesImage from '../assets/projects/orbit-notes.svg'
import pulseMobileImage from '../assets/projects/pulse-mobile.svg'
import signalLabImage from '../assets/projects/signal-lab.svg'

export type Project = {
  name: string
  description: string
  image: string
  imageAlt: string
  githubUrl: string
}

export const projects: Project[] = [
  {
    name: 'Nebula Dashboard',
    description: '面向创意团队的数据看板示例，聚合实时指标与项目进度。',
    image: nebulaDashboardImage,
    imageAlt: 'Nebula Dashboard 数据看板预览',
    githubUrl: 'https://github.com/example/nebula-dashboard',
  },
  {
    name: 'Orbit Notes',
    description: '用卡片整理灵感与研究资料的轻量笔记空间。',
    image: orbitNotesImage,
    imageAlt: 'Orbit Notes 卡片笔记界面预览',
    githubUrl: 'https://github.com/example/orbit-notes',
  },
  {
    name: 'Pulse Mobile',
    description: '关注日常节奏的移动端健康追踪体验示例。',
    image: pulseMobileImage,
    imageAlt: 'Pulse Mobile 移动端健康追踪界面预览',
    githubUrl: 'https://github.com/example/pulse-mobile',
  },
  {
    name: 'Signal Lab',
    description: '探索声音与数据关系的互动式可视化实验室。',
    image: signalLabImage,
    imageAlt: 'Signal Lab 数据可视化工作区预览',
    githubUrl: 'https://github.com/example/signal-lab',
  },
]
