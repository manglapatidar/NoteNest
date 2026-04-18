import React, { useState } from 'react';

export default function StarRating({ initialRating = 0, onRate }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (r) => {
    setRating(r);
    if (onRate) onRate(r);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`text-3xl cursor-pointer hover:scale-125 transition-transform focus:outline-none ${
              star <= (hoverRating || rating) ? 'text-[#F59E0B]' : 'text-[#26282C]'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && (
        <div className="mt-3 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] rounded-xl px-3 py-1 text-xs text-center inline-block">
          You rated this note {rating}/5
        </div>
      )}
    </div>
  );
}
