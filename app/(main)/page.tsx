export default function CommandCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Get Things Done</h1>
        <p className="text-foreground-secondary mt-2">Welcome to your Command Center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Priorities</h3>
          <p className="text-foreground-muted text-sm">Your urgent tasks will appear here</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Daily Motivation</h3>
          <p className="text-foreground-muted text-sm">Inspiring quotes to start your day</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Discipline Bank</h3>
          <p className="text-foreground-muted text-sm">Your daily affirmations</p>
        </div>
      </div>
    </div>
  );
}
