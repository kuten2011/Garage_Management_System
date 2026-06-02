export const parseVietnamAddress = (diaChi = "") => {
  const parts = String(diaChi)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const lastFour = parts.slice(-4);

  return {
    street: lastFour[0] || "",
    ward: lastFour[1] || "",
    district: lastFour[2] || "",
    province: lastFour[3] || "",
  };
};

export const buildVietnamAddress = ({ street = "", ward = "", district = "", province = "" }) =>
  [street, ward, district, province].filter(Boolean).join(", ");
