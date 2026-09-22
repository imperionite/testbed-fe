import {
	FIELD_RULES,
	MODES,
	ROLES,
	evaluationFormConfig
} from "./form/formConfig";

export function getEvaluationManagementPermissions(role) {
	const isHTE_Supervisor = role === ROLES.HTE_SUPERVISOR;

	const isFaculty_Adviser = role === ROLES.FACULTY_ADVISER;

	const isInternship_Coordinator = role === ROLES.INTERNSHIP_COORDINATOR;

	const isStudent = role === ROLES.STUDENT;

	const isAdmin = role === ROLES.ADMIN

	return {
		canViewMyEvaluationsList: isHTE_Supervisor || isFaculty_Adviser,
		canViewInternEvaluationsList: isInternship_Coordinator || isStudent || isHTE_Supervisor || isFaculty_Adviser || isAdmin,
		canView: isHTE_Supervisor || isStudent || isFaculty_Adviser,
		canViewDetail: isInternship_Coordinator || isStudent || isHTE_Supervisor || isFaculty_Adviser || isAdmin,
		canCreate: isHTE_Supervisor || isFaculty_Adviser,
		canEdit: isHTE_Supervisor || isFaculty_Adviser,
		canToggleStatus: isHTE_Supervisor || isFaculty_Adviser,
		canBulkEdit: isHTE_Supervisor || isFaculty_Adviser,
		canSelectRows: isHTE_Supervisor || isFaculty_Adviser,
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