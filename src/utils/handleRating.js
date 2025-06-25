/**
 * Map rating value (1-5) to Vietnamese rating label
 * 1: Cơ bản
 * 2: Tiêu Chuẩn
 * 3: Khá Tốt
 * 4: Tốt
 * 5: Rất Tốt
 */
export const ratingLabelMap = {
  1: "Cơ bản",
  2: "Tiêu Chuẩn",
  3: "Khá Tốt",
  4: "Tốt",
  5: "Rất Tốt",
};


export default function handleRating(value) {
  return ratingLabelMap[Math.floor(value)] || "Không xác định";
}
