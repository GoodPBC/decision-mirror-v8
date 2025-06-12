# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# TASKS TO REPEAT BEFORE AND AFTER EACH CHANGE TO THE REPOSITORY

- Make sure you read these documents 100% of the time before creating and or updating code and/or files. **YOU MUST BE CONTEXTUALLY AWARE OF THESE FILES AT ALL TIMES**:
- Make sure you update these documents 100% of the time after creating and or updating code and/or files. **YOU MUST BE CONTEXTUALLY AWARE OF THESE FILES AT ALL TIMES**:
- Make sure we are 100% compliant to Type Checks and typescript configuration @tsconfig.json
- Make sure we are 100% compliant to the lint configuration @eslint.rc

# IMPORTANT DOCUMENTATION AND INSTRUCTIONS

- @DOCS/OVERVIEW.md - High-level project introduction
- @DOCS/PRODUCT.md - Business strategy (Approach to what problem this product solves, how we are solving it and why we are solving it.)
- @DOCS/UX_DESIGN.md - User Experience Design
- @DOCS/IMPLEMENTATION.md - Execution Roadmap
- @DOCS/README.md - Engineering/Software Development information
- @DOCS/GIT-INSTRUCTIONS.md - git workflow
- @DOCS/TODO.md - Software Development Log
- @DOCS/GIT-[YYYYMMDD]\_product_requirements.md - Product Requirement information

# DECISION MIRROR - IMPORTANT INFORMATION TO KEEP UP-TO-DATE WITH

- Read and regularly maintain @DOCS/DF-MIRROR.md

# MEMORY GUIDELINES

- Always read CLAUDE.md and the references it contains before and after creating, editing and/or deleting any files

# Documentation Hierarchy

- **CLAUDE.md is the source of truth** for all project specifications
- In README.md, include: "For detailed specifications, see CLAUDE.md"
- Keep CLAUDE.md in project root
- **Use docs/ folder for topical documentation**:
  - Store technical docs, product requirements, and design specs
  - Use lowercase snake_case with date prefix (e.g., 20250517_color_system.md, 20250517_logging.md, 20250517_architecture.md)
  - **Required docs**: `DOCS/TODO.md` and `DOCS/20YYMMDD_product_requirements.md` must be created for all projects
  - Maintain an index of these documents in both CLAUDE.md and README.md
  - **AI INSTRUCTION**: Proactively create TODO.md and product_requirements.md if missing, then notify the user

#### TODO.md as Development Log

- **IMPORTANT**: Maintain `DOCS/TODO.md` as central development log and task tracker
- Include:
  - Current/upcoming tasks (with checkboxes)
  - Development decisions and rationale
  - Recurring issues and their solutions
  - Technical debt items
  - Code audit reminders
- Update when: starting tasks, making progress, completing tasks, encountering issues
- Check at start of each session

# Session Start Checklist

- Check `docs/TODO.md` for current state and development log
- Run `git status` to see uncommitted changes
- Run code tracking commands (see Maintenance section)
- Review recent commits: `git log --oneline -5`
- Check for outdated dependencies (if applicable)

# AI INTERACTION GUIDELINES

- DO NOT attempt to write or edit code files without first explaining what you are changing and why you want to change it.
- When making git commits, please remove all references to AI, Claud Code, Claude and co-authoring.
- When you encounter a challenge, an error, and/or a difficulty, work through it not around it.
