
export function MobileNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="lg:hidden bg-background border-b p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Success OS</h1>
      <button onClick={onMenuClick} className="px-4 py-2 bg-primary text-white rounded">Menu</button>
    </div>
  );
}