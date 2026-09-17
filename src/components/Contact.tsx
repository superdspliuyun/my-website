import { profile } from '../data/profile';

/** 字段值非空（含非纯空白）时返回 true。 */
function hasContent(s: string): boolean {
  return s.trim().length > 0;
}

/**
 * 联系区块（spec「contact-section」）。
 *
 * 关键点（design D8 + spec 全部 Requirements）：
 *   - 根元素 <section id="contact"> 与 Nav "联系我"链接 href="#contact" 严格一致。
 *   - 结构镜像 Projects 区块：mx-auto max-w-5xl + border-t + py-20。
 *   - 字段缺失兜底：标题/简介为空时不渲染空 DOM；邮箱为空时退化为占位文本（不可点击，避免 mailto:空收件人）。
 *   - 主题：复用全站 <html class="dark"> 切换与 @theme token，组件零感知。
 */
function Contact() {
  const { email, contactTitle, contactIntro } = profile;
  const hasEmail = hasContent(email);
  const hasTitle = hasContent(contactTitle);
  const hasIntro = hasContent(contactIntro);

  return (
    <section
      id="contact"
      aria-label="联系入口"
      className="relative w-full border-t border-border bg-background px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        {hasTitle && (
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {contactTitle}
          </h2>
        )}

        {hasIntro && (
          <p className="mt-3 text-base text-muted md:text-lg">
            {contactIntro}
          </p>
        )}

        <div className="mt-8">
          {hasEmail ? (
            <a
              href={`mailto:${email}`}
              className="inline-block text-base font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:text-lg"
            >
              {email}
            </a>
          ) : (
            // 邮箱缺失时 MUST 退化为占位文本而非可点击元素（spec「字段缺失兜底」）
            <p className="text-base text-muted md:text-lg">[邮箱地址]</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;