import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

/**
 * Projects 区块（spec「Projects 区块展示」）。
 *
 * 关键点：
 *   - 根元素 <section id="projects"> 与 Hero CTA href="#projects" 严格一致（design D1 + tasks 4.2 断言）。
 *   - 配置空数组兜底：渲染"暂无项目"占位文案（design D6 + spec Scenario "配置为空数组"）。
 *   - 网格：移动端单列（grid-cols-1）/ 桌面端 2 列（sm:grid-cols-2）/ 大屏不拉空（max-w-5xl mx-auto）。
 *   - 与 Hero 之间视觉分隔：使用 border-t + 充足 py-20。
 *   - 主题：复用全站 <html class="dark"> 切换与 @theme token，组件零感知。
 */
function Projects() {
  return (
    <section
      id="projects"
      aria-label="项目集合"
      className="relative w-full border-t border-border bg-background px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          项目
        </h2>
        <p className="mt-3 text-base text-muted md:text-lg">
          一些我最近在做的事。
        </p>

        {projects.length === 0 ? (
          // 空数组兜底（design D6 / spec Scenario "配置为空数组"）
          <p className="mt-12 text-muted">暂无项目</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
