import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-20 bg-slate-100 px-6 py-24 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="projects-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
          项目
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">一些正在探索的方向与作品。</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
