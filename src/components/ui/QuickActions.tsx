import { Phone, MessageCircle, Mail } from 'lucide-react';

interface QuickActionsProps {
  mobile?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

export default function QuickActions({ mobile, whatsapp, email }: QuickActionsProps) {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent card click event
    action();
  };

  return (
    <div className="flex gap-2">
      {mobile && (
        <a
          href={`tel:${mobile}`}
          onClick={(e) => handleClick(e, () => {})}
          className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          title="Call"
        >
          <Phone className="w-3.5 h-3.5" />
        </a>
      )}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleClick(e, () => {})}
          className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          title="WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          onClick={(e) => handleClick(e, () => {})}
          className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          title="Email"
        >
          <Mail className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}
