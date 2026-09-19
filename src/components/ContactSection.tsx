function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 bg-slate-50 px-6 py-24 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="contact-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
          联系我
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          联系方式正在准备中，敬请期待。
        </p>
      </div>
    </section>
  )
}

export default ContactSection
