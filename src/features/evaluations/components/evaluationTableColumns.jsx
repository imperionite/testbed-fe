import { Rating } from "@mui/material";

//-----------------
// HELPERS
//-----------------

const formatCellDate = (value) => {
  if (!value && value !== 0) return null;

  try {
    const dateObj = new Date(value);

    if (isNaN(dateObj.getTime())) return null;

    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
};

//-----------------
// MAIN FUNCTION
//-----------------
export function createEvaluationTableColumns({internMap = {} }) {
  return [
    {
      accessorKey: "internship_id",
      header: "Intern",
      size: 260,
      enableColumnFilter: true,
      enableEditing: false,
      Cell: ({ cell }) => {
        
        const id = cell.getValue();
        if (!id) return "Unknown";
        return internMap[id] ?? id;
      },
    },
    {
      accessorKey: "evaluation_type",
      header: "Evaluation Type",
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
  accessorKey: "responses",
  header: "Responses",
  Cell: ({ cell }) => {
    const responses = cell.getValue();
    const entries = responses && !Array.isArray(responses)
      ? Object.entries(responses).map(([criteria, score]) => ({ criteria, score }))
      : responses || [];

    return (
      <div>
        {entries.map(({ criteria, score }) => (
          <div key={criteria}>
            <div>{criteria}</div>
            <Rating value={score} readOnly max={5} />
          </div>
        ))}
      </div>
    );
  },

},
    {
      accessorKey: "comments",
      header: "Comments",
      size: 220,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 160,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      size: 130,
      enableColumnFilter: false,
      enableEditing: false,
      Cell: ({ cell }) => formatCellDate(cell.getValue()),
    },
  ];
}
