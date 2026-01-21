export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm text-white/70 md:text-base">{subtitle}</p>
    </div>
  );
}
