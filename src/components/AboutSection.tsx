import { useState } from 'react'
import cloudsImage from '../assets/about/clouds.jpg'

function AboutSection() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-slate-50 px-6 py-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-10">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 md:w-1/2 md:justify-self-end">
          {imageFailed ? (
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-sky-200 via-indigo-200 to-slate-300 p-8 text-center text-lg font-medium text-slate-700 dark:from-sky-950 dark:via-indigo-950 dark:to-slate-900 dark:text-slate-200">
              云彩照片暂时无法加载
            </div>
          ) : (
            <img
              src={cloudsImage}
              alt="阳光穿过层叠云彩的蓝天"
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
            About me
          </p>
          <h2 id="about-title" className="text-4xl font-bold tracking-tight sm:text-5xl">
            关于我
          </h2>
          <p className="mt-6 text-2xl font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
            自由、洒脱、奔放
          </p>
          <p className="mt-8 inline-flex rounded-full border border-sky-300/70 bg-sky-100/70 px-5 py-2 text-base font-medium text-sky-800 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200">
            云卷云舒
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
