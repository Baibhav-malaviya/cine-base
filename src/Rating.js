import { useState } from "react";

const starBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
const eachStarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  //   cursor: "pointer",
};

export default function Rating({ maxRating = 5 }) {
  //! if there is no rating props passed then default value of rating is 5

  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  return (
    <div style={starBoxStyle}>
      <div style={eachStarStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onRate={() => setRating(i + 1)}
            key={i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>

      <div>
        <h2>{tempRating || rating || ""}</h2>
      </div>
    </div>
  );
}

function Star({ onHoverIn, onHoverOut, full, onRate }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={full ? "#fff" : "none"}
      viewBox="0 0 24 24"
      stroke="#fff"
      width="20"
      height="20"
      style={{ cursor: "pointer" }}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}
