---
trigger: always_on
---

policy_id: AG-TYPE-SAFETY-01
policy_name: Zero Type & Build Error Enforcement
policy_version: 1.0.0
policy_scope:

- global
- all_projects
- all_languages
- typescript
- nextjs
- prisma

severity: BLOCKING
failure_mode: HALT_AND_FIX

description: >
  Prevents Antigravity from producing or finalizing any code that introduces
  TypeScript, Prisma, build-time, or lint-blocking errors. Code with unresolved
  errors is considered incomplete and invalid.

---

preconditions:
  before_writing_code:
    - verify_exports_exist: true
    - verify_import_paths: true
    - verify_component_props: true
    - verify_hook_return_types: true
    - verify_prisma_models_and_fields: true
    - verify_route_handler_signatures: true
    - forbid_assumed_apis: true

---

coding_phase:
  incremental_checks:
    frequency: AFTER_EACH_MEANINGFUL_CHANGE
    required_question: "Would this compile with `tsc --noEmit`?"
    on_uncertainty:
      action: HALT
      message: "Type safety cannot be guaranteed without verification."

  forbidden_behaviors:
    - guessing_exports
    - inventing_types
    - inventing_prisma_fields
    - optimistic_ui_imports
    - suppressing_type_errors
    - leaving_unused_imports

---

postconditions:
  mandatory_audit:
    checks_equivalent_to:
      - tsc --noEmit
      - next build
      - prisma generate
      - eslint (blocking rules only)

    completion_requirement:
      no_type_errors: true
      no_prisma_errors: true
      no_build_errors: true

    confirmation_message: >
      "TypeScript, Prisma, and build checks pass with no blocking errors."

    on_failure:
      action: FIX_BEFORE_RESPONSE
      report_format:
        - file_path
        - line_number
        - error_message
        - applied_fix

---

prisma_rules:
  strict_schema_adherence: true
  forbid_nonexistent_models: true
  forbid_nonexistent_fields: true
  require_exact_input_types:
    - WhereInput
    - CreateInput
    - UncheckedCreateInput
  require_client_regeneration: true
  failure_severity: BLOCKING

---

ui_component_rules:
  import_validation_required: true
  forbid_nonexistent_components: true
  props_must_match_types: true
  forbid_unused_imports: true
  resolution_strategy:
    - implement_missing_component
    - refactor_to_existing_component
    - abort_with_explanation

---

route_and_api_rules:
  enforce_correct_signatures: true
  forbid_invalid_request_response_types: true
  forbid_untyped_handlers: true

---

professional_standards:
  assume_ci_strict: true
  typescript_strict_mode: true
  noImplicitAny: true
  production_ready_only: true
  senior_engineer_review_assumed: true

---

allowed_fallback:
  when_verification_impossible:
    response_template: >
      "Cannot safely proceed without confirming {missing_information}.
       Continuing would risk type or build errors."
    proceed_without_confirmation: false

---

continuous_enforcement:
  on_shared_type_change:
    rescan_modified_files: true
    enforce_backward_compatibility: true

---

completion_gate:
  final_state_required:
    - clean_typecheck
    - clean_build
    - clean_prisma
  otherwise: TASK_INVALID
