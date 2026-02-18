export const getTimeRemaining = (deadline) => {
  if (!deadline) return "Invalid Date"; // Handle undefined/null case

  const now = new Date();
  const endTime = new Date(Date.parse(deadline)); // Explicitly parse deadline

  if (isNaN(endTime)) return "Invalid Date"; // Handle incorrect formats

  const diff = endTime - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m left`;

  return `${minutes}m left`;
};
