interface GreetingHeaderProps {
  userName?: string;
}

export default function GreetingHeader({ userName = 'User' }: GreetingHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        {getGreeting()}, {userName}
      </h1>
      <p className="text-xs md:text-sm text-gray-500 mt-1">{getFormattedDate()}</p>
    </div>
  );
}
