/**
 * Executes create or sequential update mutations based on form mode and field diffs.
 */
export async function executeUserSave({
  mode,
  user,
  filteredPayload,
  mutations: { createUser, updateUser, updateRole, updateStatus },
}) {
  if (mode === "create") {
    return await createUser.mutateAsync(filteredPayload);
  }

  const userId = user?.id;
  if (!userId) {
    throw new Error("User ID is missing for the update operation.");
  }

  // Core Profile Update
  await updateUser.mutateAsync({ id: userId, payload: filteredPayload });

  // Role Change Mutation (if role changed)
  if (filteredPayload.role && filteredPayload.role !== user.role) {
    await updateRole.mutateAsync({ id: userId, role: filteredPayload.role });
  }

  // Status Change Mutation (if isActive state changed)
  const updatedActive = filteredPayload.isActive;
  const originalActive = user.isActive;
  if (updatedActive !== undefined && updatedActive !== originalActive) {
    await updateStatus.mutateAsync({ id: userId, isActive: updatedActive });
  }
}

