import { useQuery } from "@tanstack/react-query";
import { studentApi } from "../../../api/students";

export function useStudents(role) {
  const isStaff = ["administrator", "internship_coordinator", "hte_supervisor"].includes(role);
  
  return useQuery({
    queryKey: ["students", isStaff ? "all" : "me"],
    queryFn: isStaff ? studentApi.listStudents : studentApi.getMyProfile,
  });
}
