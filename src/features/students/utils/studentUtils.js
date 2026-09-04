export const formatStudentName = (firstName, middleName, lastName) => {
  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : "";
  return `${firstName} ${middleInitial ? middleInitial + " " : ""}${lastName}`;
};
