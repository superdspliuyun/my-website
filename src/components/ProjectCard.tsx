import { useState } from 'react'
import type { Project } from '../data/projects'

type ProjectCardProps = {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:transform-none dark:border-slate-700 dark:bg-slate-900">
      <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
        {imageFailed ? (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
            项目截图暂时无法加载
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{project.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {project.description}
        </p>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-fit rounded-md text-sm font-semibold text-cyan-700 underline decoration-cyan-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500 dark:text-cyan-300 dark:decoration-cyan-700"
        >
          查看 Github
        </a>
      </div>
    </article>
  )
}

export default ProjectCard
