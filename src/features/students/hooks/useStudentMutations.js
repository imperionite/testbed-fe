import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "../../../api/students";
import notify from "../../../utils/toast";

export function useStudentMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["students"] });

  const onCreate = useMutation({
    mutationFn: (payload) => studentApi.createStudent(payload),
    onSuccess: async () => {
      await invalidate();
      notify.success("Student created successfully!");
    },
  });

  const onUpdate = useMutation({
    mutationFn: ({ id, payload, role }) => {
      if (role === "student") {
        return studentApi.updateMyProfile(payload);
      }
      return studentApi.updateStudent(id, payload);
    },
    onSuccess: async (_, variables) => {
      await invalidate();
      if (variables.role === "student") {
        await queryClient.invalidateQueries(["me"]);
      }
      notify.success("Student updated successfully!");
    },
  });

  return { onCreate, onUpdate };
}
