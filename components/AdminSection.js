export default function AdminSection({ title, description, children, preview, columns = 1 }) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-gold pl-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-white/60">{description}</p>
        )}
      </div>

      {/* 编辑表单 - 支持多列布局 */}
      <div className={`grid gap-4 ${columns === 2 ? 'lg:grid-cols-2' : ''}`}>
        {children}
      </div>
    </div>
  );
}
