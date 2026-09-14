export const formatStudentName = (firstName, middleName, lastName) => {
  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : "";
  return `${firstName} ${middleInitial ? middleInitial + " " : ""}${lastName}`;
};

export const mapStudentData = (student, userRecord = {}) => {
  const profiles = student.profiles || {};
  const meta = userRecord.user_metadata || {};

  return {
    ...student,
    userId: student.id,
    internship_status: student.currentInternship?.status || student.internship_status || 'pending',
    email: profiles.email || student.email || userRecord.email || meta.email || "",
    firstName:
      profiles.first_name ||
      student.firstName ||
      student.first_name ||
      userRecord.firstName ||
      userRecord.first_name ||
      meta.firstName ||
      meta.first_name ||
      "",
    middleName:
      profiles.middle_name ||
      student.middleName ||
      student.middle_name ||
      userRecord.middleName ||
      userRecord.middle_name ||
      meta.middleName ||
      meta.middle_name ||
      "",
    lastName:
      profiles.last_name ||
      student.lastName ||
      student.last_name ||
      userRecord.lastName ||
      userRecord.last_name ||
      meta.lastName ||
      meta.last_name ||
      "",
  };
};
