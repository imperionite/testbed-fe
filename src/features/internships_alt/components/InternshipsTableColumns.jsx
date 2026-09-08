import { Typography } from "@mui/material";
import BadgeStatus from "./BadgeStatus";

const getStudentProfile = (row) => row.student_profiles || {};

export function createInternshipTableColumns({ users = [] }) {
  const getStudentName = (studentId) => {
    if (!studentId) return "N/A";
    const user = users.find((u) => u.id === studentId);
    if (!user) return "N/A";
    return [user.lastName, user.firstName, user.middleName, user.suffix]
      .filter(Boolean)
      .join(" ");
  };

  return [
    {
      id: "student",
      header: "Student",
      accessorFn: (row) => {
        const profile = getStudentProfile(row);
        return profile.student_number || row.student_id || "N/A";
      },
      Cell: ({ row }) => {
        const profile = getStudentProfile(row.original);
        const studentId = row.original.student_id;
        const name = getStudentName(studentId);

        return (
          <div>
            <Typography variant="body2">{name || "N/A"}</Typography>
            <Typography variant="caption" color="text.secondary">
              {profile.student_number || "No student number"}
            </Typography>
          </div>
        );
      },
      enableEditing: false,
    },
    {
      id: "hte",
      header: "HTE Partner",
      accessorFn: (row) => row.hte_profiles?.company_name || "N/A",
      enableEditing: false,
    },
    {
      id: "program",
      header: "Program",
      accessorFn: (row) => row.student_profiles?.program || "N/A",
      enableEditing: false,
    },
    {
      accessorKey: "required_hours",
      header: "Required Hours",
      enableEditing: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => <BadgeStatus value={cell.getValue()} />,
      enableEditing: true,
      editVariant: "select",
      editSelectOptions: ["pending", "active", "completed"],
    },
    {
      id: "facultyAdviser",
      header: "Faculty Adviser",
      accessorFn: (row) => {
        // Check if faculty_adviser_id exists
        if (!row.faculty_adviser_id) return "Unassigned";
        
        // Find the faculty adviser in the users array passed as prop
        const adviser = users.find((u) => u.id === row.faculty_adviser_id);
        if (!adviser) return "Unassigned";
        
        // Return adviser's name
        const nameParts = [adviser.lastName, adviser.firstName, adviser.middleName, adviser.suffix];
        return nameParts.filter(Boolean).join(" ");
      },
      enableEditing: false,
    },
  ];
}

export default createInternshipTableColumns;
