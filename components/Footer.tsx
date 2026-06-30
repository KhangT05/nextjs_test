export function Footer() {
  return (
    <footer className="py-10 border-t border-midnight/5 dark:border-bone/5">
      <div className="container-x section-pad flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <p className="font-mono">© {new Date().getFullYear()} AuraRing</p>
        <p>Sản phẩm minh họa cho mục đích học tập — không phải thiết bị y tế.</p>
      </div>
    </footer>
  );
}
