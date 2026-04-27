export const formatPrice = (price: number): string => {
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 1000) return price.toFixed(2);
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatPercentage = (percentage: number): string => {
  const sign = percentage > 0 ? "+" : "";
  return `${sign}${percentage.toFixed(2)}%`;
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000_000)
    return `$${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(2)}K`;
  return `$${volume.toFixed(2)}`;
};

export const getChangeColor = (change: number): string => {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-gray-500";
};
