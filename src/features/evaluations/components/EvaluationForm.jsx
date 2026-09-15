import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  // FormHelperText,
  Paper,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { evaluationFormConfig } from "../form/formConfig";
import {
  getEvaluationFormPermissions,
  getVisibleEvaluationFields,
} from "../evaluationPermissions";
import getValidationSchema from "../form/EvaluationValidationSchema";
import { formatEvaluationStatus, formatDate } from "../form/fieldFormatters";

export default function EvaluationForm({
  role,
  mode,
  defaultValues = {},
  onSubmit,
  onInvalid,
  formId = "evaluation-form",
  evaluationTypeOptions = ["hte_supervisor"],
  internOptions = [],
  criteriaList = [], // Pass hardcoded criteria from parent
  allowDynamicCriteria = true, // Enable/disable dynamic criteria input
}) {
  const { getFieldRule } = getEvaluationFormPermissions(role, mode);
  const schema = getValidationSchema(mode);
  const [criteria, setCriteria] = useState(criteriaList);
  const [newCriterion, setNewCriterion] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const responsesValue = useWatch({
    control,
    name: "responses",
    defaultValue: {},
  }) || {};

  const handleAddCriterion = () => {
    const trimmedCriterion = newCriterion.trim();

    if (!trimmedCriterion || criteria.includes(trimmedCriterion)) {
      return;
    }

    setCriteria((previousCriteria) => [...previousCriteria, trimmedCriterion]);

    setNewCriterion("");
  };

  const handleRemoveCriterion = (criterionToRemove) => {
    setCriteria((previousCriteria) =>
      previousCriteria.filter((criterion) => criterion !== criterionToRemove),
    );

    const updatedResponses = { ...responsesValue };
    delete updatedResponses[criterionToRemove];

    setValue("responses", updatedResponses);
  };

  const handleRatingChange = (criterion, newValue) => {
    setValue("responses", {
      ...responsesValue,
      [criterion]: newValue,
    });
  };

  const handleSubmitData = (data) => {
    const payload = evaluationFormConfig.reduce((acc, field) => {
      if (getFieldRule(field) !== "hidden" && data[field.name] !== undefined) {
        acc[field.name] = data[field.name];
      }
      return acc;
    }, {});

    onSubmit?.(payload);
  };

  const visibleFields = getVisibleEvaluationFields(role, mode);

  return (
    <Stack
      component="form"
      id={formId}
      onSubmit={handleSubmit(handleSubmitData, onInvalid)}
      spacing={2}
    >
      {visibleFields.map((field) => {
        const rule = getFieldRule(field);
        const isDisabled = rule === "readonly";
        const isRequired = rule === "required";

        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: rhfField }) => {
              if (field.type === "intern-select") {
                if (isDisabled) {
                  const match = internOptions.find(
                    (u) => u.id === rhfField.value,
                  );
                  const displayName = match
                    ? [match.last_name, match.first_name]
                        .filter(Boolean)
                        .join(", ")
                    : rhfField.value;
                  return (
                    <TextField
                      value={displayName}
                      label={field.label}
                      disabled
                      fullWidth
                      size="small"
                    />
                  );
                }
                return (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors[field.name]}
                  >
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      {...rhfField}
                      value={rhfField.value ?? ""}
                      label={field.label}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {internOptions.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {[u.last_name, u.first_name]
                            .filter(Boolean)
                            .join(", ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              if (field.type === "evaluation_type") {
                return (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors[field.name]}
                  >
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      {...rhfField}
                      value={rhfField.value ?? ""}
                      label={field.label}
                      disabled={isDisabled}
                    >
                      {evaluationTypeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              if (field.type === "responses") {
                return (
                  <Paper
                    key={field.name}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {field.label}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Rate each criterion from 1 to 5.
                      </Typography>
                    </Box>

                    {allowDynamicCriteria && !isDisabled && (
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Add criterion"
                          value={newCriterion}
                          onChange={(event) =>
                            setNewCriterion(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleAddCriterion();
                            }
                          }}
                        />

                        <Button
                          type="button"
                          variant="outlined"
                          onClick={handleAddCriterion}
                          disabled={!newCriterion.trim()}
                        >
                          Add
                        </Button>
                      </Stack>
                    )}

                    <Stack spacing={1}>
                      {criteria.map((criterion) => (
                        <Box
                          key={criterion}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            backgroundColor: "action.hover",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              fontWeight: 500,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {criterion}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexShrink: 0,
                            }}
                          >
                            <Rating
                              value={responsesValue[criterion] ?? 0}
                              onChange={(_, newValue) =>
                                handleRatingChange(criterion, newValue)
                              }
                              disabled={isDisabled}
                              max={5}
                              size="medium"
                            />

                            {allowDynamicCriteria &&
                              !isDisabled &&
                              !criteriaList.includes(criterion) && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  aria-label={`Remove ${criterion}`}
                                  onClick={() =>
                                    handleRemoveCriterion(criterion)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                );
              }

              if (field.type === "comments") {
                return (
                  <TextField
                    {...rhfField}
                    label={field.label}
                    disabled={isDisabled}
                    required={isRequired}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                  />
                );
              }

              if (field.type === "status" && isDisabled) {
                return (
                  <Chip
                    label={formatEvaluationStatus(rhfField.value)}
                    color={rhfField.value === "true" ? "success" : "disabled"}
                    variant="outlined"
                  />
                );
              }

              if (field.type === "status") {
                return (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rhfField.value === true}
                        onChange={(event) =>
                          rhfField.onChange(event.target.checked)
                        }
                        disabled={isDisabled}
                      />
                    }
                    label={formatEvaluationStatus(rhfField.value)}
                  />
                );
              }

              return (
                <TextField
                  {...rhfField}
                  value={
                    field.format === "date"
                      ? formatDate(rhfField.value)
                      : (rhfField.value ?? "")
                  }
                  label={field.label}
                  type={field.type}
                  disabled={isDisabled}
                  required={isRequired}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  fullWidth
                  size="small"
                />
              );
            }}
          />
        );
      })}
    </Stack>
  );
}
