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
	if (!field || !field.rbac) {
		return FIELD_RULES.HIDDEN;
	}

	// Look up the { create, edit, view } object for this role.
	const modeRulesForRole = field.rbac[role];
	if (modeRulesForRole === undefined) {
		return FIELD_RULES.HIDDEN;
	}

	// Pick the single rule value for this mode {"required", "hidden", "readonly"}
	const fieldRuleForMode = modeRulesForRole[mode];
	if (fieldRuleForMode === undefined) {
		return FIELD_RULES.HIDDEN;
	}

	return fieldRuleForMode;
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