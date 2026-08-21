import {
	FIELD_RULES,
	MODES,
	ROLES,
	userFormConfig,
} from "./form/formConfig";

export function getUserManagementPermissions(role) {
	const isAdmin = role === ROLES.ADMIN;

	return {
		canView: isAdmin,
		canCreate: isAdmin,
		canEdit: isAdmin,
		canEditRole: isAdmin,
		canToggleStatus: isAdmin,
		canBulkEdit: isAdmin,
		canSelectRows: isAdmin,
	};
}

export function getFieldRule(field, role, mode) {
	return field?.rbac?.[role]?.[mode] || FIELD_RULES.HIDDEN;
}

export function canDoOperation(role, mode) {
	return role === ROLES.ADMIN && (mode === MODES.CREATE || mode === MODES.EDIT);
}

export function getUserFormPermissions(role, mode) {
	return {
		getFieldRule: (field) => getFieldRule(field, role, mode),
		canSubmit: canDoOperation(role, mode),
	};
}

export function getVisibleUserFields(role, mode) {
	return userFormConfig.filter(
		(field) => getFieldRule(field, role, mode) !== FIELD_RULES.HIDDEN,
	);
}

export const userPermissions = getUserFormPermissions;