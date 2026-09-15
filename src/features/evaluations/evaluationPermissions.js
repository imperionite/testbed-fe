import {
	FIELD_RULES,
	MODES,
	ROLES,
	evaluationFormConfig
} from "./form/formConfig";

export function getEvaluationManagementPermissions(role) {
	const isHTE_Supervisor = role === ROLES.HTE_SUPERVISOR;

	const isInternship_Coordinator = role === ROLES.INTERNSHIP_COORDINATOR;

	const isStudent = role === ROLES.STUDENT;

	return {
		canViewMyEvaluationsList: isHTE_Supervisor,
		canViewInternEvaluationsList: isInternship_Coordinator || isStudent || isHTE_Supervisor,
		canView: isHTE_Supervisor || isStudent,
		canViewDetail: isInternship_Coordinator || isStudent || isHTE_Supervisor,
		canCreate: isHTE_Supervisor,
		canEdit: isHTE_Supervisor,
		canToggleStatus: isHTE_Supervisor,
		canBulkEdit: isHTE_Supervisor,
		canSelectRows: isHTE_Supervisor,
	};
}




// ------------------ HELPERS ---------------------

export function getFieldRule(field, role, mode) {
	if (!field || !field.rbac) {
		return FIELD_RULES.HIDDEN;
	}

	// Look up the { create, edit, view } object for this role.
	const roleRules = Array.isArray(field.rbac)
		? Object.assign({}, ...field.rbac)
		: field.rbac;
	const modeRulesForRole = roleRules[role];
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

export function getEvaluationFormPermissions(role, mode) {
	return {
		getFieldRule: (field) => getFieldRule(field, role, mode),
		canSubmit: canDoOperation(role, mode),
	};
}

export function getVisibleEvaluationFields(role, mode) {
	return evaluationFormConfig.filter(
		(field) => getFieldRule(field, role, mode) !== FIELD_RULES.HIDDEN,
	);
}

export const evaluationPermissions = getEvaluationFormPermissions;