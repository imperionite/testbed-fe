# FR-08 Evaluation Form Suggestion - Frontend

## Evaluation Form

SBIMS should use **one common evaluation form** for both:

- HTE Supervisor
- Faculty Adviser

Both evaluator types use the **same 8 criteria** and the same **1–5 rating scale**.

The only difference is the `evaluation_type` sent to the API.

---

## Recommended Evaluation Criteria

For SBIMS, use these 8 criteria:

| #   | Criterion                   |
| --- | --------------------------- |
| 1   | Knowledge of Assigned Tasks |
| 2   | Quality of Work             |
| 3   | Productivity                |
| 4   | Problem-Solving             |
| 5   | Communication               |
| 6   | Teamwork                    |
| 7   | Professionalism             |
| 8   | Adaptability                |

These should be displayed as readable labels in the React interface rather than exposing names such as `criterion_1` to the evaluator.

Example:

```text
INTERNSHIP EVALUATION

Student: Juan Dela Cruz
Evaluation: HTE Supervisor Evaluation

1. Knowledge of Assigned Tasks

   ○ 1    ○ 2    ○ 3    ○ 4    ○ 5
  Poor   Fair   Satisfactory  Good  Excellent

2. Quality of Work

   ○ 1    ○ 2    ○ 3    ○ 4    ○ 5
  Poor   Fair   Satisfactory  Good  Excellent

...

8. Adaptability

   ○ 1    ○ 2    ○ 3    ○ 4    ○ 5
  Poor   Fair   Satisfactory  Good  Excellent

Comments
┌──────────────────────────────────────────┐
│ Enter comments...                         │
└──────────────────────────────────────────┘

[ Save Draft ]    [ Submit Evaluation ]
```

---

## Rating Scale

Use a fixed **1–5 Likert-style scale**:

| Value | Label        |
| ----: | ------------ |
|     1 | Poor         |
|     2 | Fair         |
|     3 | Satisfactory |
|     4 | Good         |
|     5 | Excellent    |

Each criterion should allow **exactly one rating**.

Radio buttons are recommended. They can be visually styled as selectable buttons or cards.

---

## React Criteria

Keep the criteria in a reusable array:

```js
const evaluationCriteria = [
  { key: 'criterion_1', label: 'Knowledge of Assigned Tasks' },
  { key: 'criterion_2', label: 'Quality of Work' },
  { key: 'criterion_3', label: 'Productivity' },
  { key: 'criterion_4', label: 'Problem-Solving' },
  { key: 'criterion_5', label: 'Communication' },
  { key: 'criterion_6', label: 'Teamwork' },
  { key: 'criterion_7', label: 'Professionalism' },
  { key: 'criterion_8', label: 'Adaptability' },
]
```

Store the selected ratings in React state:

```js
const [responses, setResponses] = useState({})
```

Example state:

```js
{
  criterion_1: 5,
  criterion_2: 4,
  criterion_3: 5,
  criterion_4: 4,
  criterion_5: 5,
  criterion_6: 4,
  criterion_7: 5,
  criterion_8: 4
}
```

---

## API Payload

The frontend converts the form into the API's `responses` object.

### HTE Supervisor

```json
{
  "internship_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "evaluation_type": "hte_supervisor",
  "responses": {
    "criterion_1": 5,
    "criterion_2": 4,
    "criterion_3": 5,
    "criterion_4": 4,
    "criterion_5": 5,
    "criterion_6": 4,
    "criterion_7": 5,
    "criterion_8": 4
  },
  "comments": "Good performance during the internship."
}
```

### Faculty Adviser

The same form and criteria are used:

```json
"evaluation_type": "faculty_adviser"
```

The frontend should determine the evaluator's role and use the appropriate type. **Do not allow the evaluator to arbitrarily select an evaluation type.**

The backend still verifies the evaluator's role and assignment.

---

## Draft and Submission

Evaluators should have two actions:

```text
[ Save Draft ]    [ Submit Evaluation ]
```

### Draft

Use:

```http
PATCH /evaluations/{evaluationId}
```

Drafts can be edited.

### Submit

Use:

```http
POST /evaluations/{evaluationId}/submit
```

Before submission, show a confirmation:

```text
Submit Evaluation?

Once submitted, this evaluation cannot be modified.

[ Cancel ] [ Confirm ]
```

After submission:

```text
Status: Submitted

This evaluation is read-only.
```

Disable editing controls.

---

## Frontend Validation

Before submitting, React should check that:

- All 8 criteria have a rating.
- Every rating is 1–5.
- Comments do not exceed the allowed length.

For example:

```text
Please provide a rating for all evaluation criteria.
```

However, **frontend validation is only for user experience**.

The backend remains responsible for enforcing:

- Rating values
- Required responses
- Evaluator authorization
- Evaluator type
- Internship assignment
- Evaluation eligibility
- Duplicate prevention
- Submitted evaluation immutability

---

## Evaluation Eligibility

The frontend should **not calculate internship hours or determine final eligibility**.

The backend is the source of truth.

If the internship is not eligible, display the API error:

```text
Evaluation is not yet available.

The internship period has not ended yet.
```

or:

```text
Evaluation is not yet available.

The required validated rendered hours have not been met.
```

This prevents business rules from being duplicated in React.

---

## HTE Supervisor and Faculty Adviser

Both use the **same evaluation form**:

```text
             SBIMS EVALUATION
                    │
          ┌─────────┴─────────┐
          │                   │
    HTE Supervisor       Faculty Adviser
          │                   │
          └─────────┬─────────┘
                    │
              Same 8 Criteria
                    │
                1–5 Rating
                    │
             Responses Object
                    │
                 REST API
```

Only the evaluator type differs:

```text
HTE Supervisor → hte_supervisor
Faculty Adviser → faculty_adviser
```

This is the recommended SBIMS design because it keeps the evaluation instrument **consistent, simple, and maintainable**.

---

## Student View

Students should see **submitted evaluations only**.

Example:

```text
INTERNSHIP EVALUATION

HTE Supervisor Evaluation

Knowledge of Assigned Tasks
5 - Excellent

Quality of Work
4 - Good

Productivity
5 - Excellent

...

Adaptability
4 - Good

Comments:
Good performance during the internship.

Status: Submitted
```

Students should not have:

```text
[ Edit ]
[ Save ]
[ Submit ]
```
