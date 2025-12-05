import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const affirmations = [
  "Visualize my dreams and bring them to life.",
  "I am a top performer who creates massive value for my clients.",
  "Every 'no' brings me closer to a 'yes.' Rejection is redirection.",
  "I am disciplined, focused, and unstoppable.",
  "Success is my natural state. I was born to win.",
  "I turn obstacles into opportunities.",
  "My income grows as I grow. I invest in myself daily.",
  "I am worthy of abundance, prosperity, and financial freedom.",
  "Rest is part of my success strategy, not a weakness.",
  "I attract ideal clients effortlessly because I provide real value.",
  "Every single day, I am getting better at what I do.",
  "I am a magnet for financial opportunities, and abundance flows to me easily.",
  "I am confident in my skills, my choices, and my worth.",
  "I accept myself completely. I deserve all the good things life offers.",
  "My mind is calm, and my body is strong and full of energy.",
  "I have the power to achieve anything I can imagine. My potential has no limits.",
  "Love flows freely between my family and me. I give love, and I am loved completely.",
  "My family is my greatest strength. We share a deep bond of happiness and support.",
  "I am a strong, loving provider. Taking care of my loved ones is easy and brings me joy.",
  "I have plenty of money to make my family's dreams come true. Making them happy feels effortless.",
  "I create strong, honest, and meaningful connections everywhere I go.",
  "I let go of all negativity. I breathe in peace, success, and pure happiness.",
];

export default function WinnersMindset() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-sm md:text-base font-semibold text-gray-900">
          The Winner's Mindset
        </h2>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
          {affirmations.map((affirmation, index) => (
            <p key={index} className="text-[10px] md:text-xs text-gray-700 leading-relaxed">
              {index + 1}. {affirmation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
