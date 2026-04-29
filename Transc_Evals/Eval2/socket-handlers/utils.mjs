// Trims non-string values to an empty string and clamps text length.
export const trimText = (value, maxLength = 500) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};
