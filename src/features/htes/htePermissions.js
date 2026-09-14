import {
	FIELD_RULES,
	MODES,
	ROLES,
	hteFormConfig as hteFormConfig,
} from "./form/formConfig";

export function getHteManagementPermissions(role) {
	const isAllowed = role === ROLES.ADMIN || role === ROLES.INTERNSHIP_COORDINATOR;

	return {
		canView: isAllowed,
		canCreate: isAllowed,
		canEdit: isAllowed,
		canToggleStatus: isAllowed,
		canBulkEdit: isAllowed,
		canSelectRows: isAllowed,
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

export function getHteFormPermissions(role, mode) {
	return {
		getFieldRule: (field) => getFieldRule(field, role, mode),
		canSubmit: canDoOperation(role, mode),
	};
}

export function getVisibleHteFields(role, mode) {
	return hteFormConfig.filter(
		(field) => getFieldRule(field, role, mode) !== FIELD_RULES.HIDDEN,
	);
}

export const htePermissions = getHteFormPermissions;