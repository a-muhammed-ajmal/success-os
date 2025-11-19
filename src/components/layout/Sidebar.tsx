
export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded">Close</button>
      </div>
    </div>
  );
}