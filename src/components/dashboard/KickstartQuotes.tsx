const quotes = [
  "The secret of getting ahead is getting started!",
  "Don't Prioritize Your Schedule; Schedule Your Priorities!",
  "Discipline is choosing between what you want now and what you want most!",
];

export default function KickstartQuotes() {
  return (
    <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-primary/10 to-purple-50 rounded-lg border border-primary/20">
      <div className="space-y-1.5">
        {quotes.map((quote, index) => (
          <p key={index} className="text-[10px] md:text-xs text-gray-700 italic font-medium">
            "{quote}"
          </p>
        ))}
      </div>
    </div>
  );
}
