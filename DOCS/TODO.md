# TODO.md - Decision Mirror Development Log

## Current Tasks

### High Priority

- [ ] Improve UI/UX of the Experience Decision Overload section
- [ ] Set up Git and GitHub Actions for version control and CI/CD
- [ ] Implement deep behavioral analytics for meaningful user session data
  - Goal: Gather interaction data to provide context for LLM and recommendation algorithm
- [ ] Refactor application for better maintainability
  - Follow best practice design patterns
  - Achieve high maintainability and low code complexity
- [ ] Check for and address memory leaks and React gotchas
- [ ] Deploy application with password protection/gating
- [ ] Implement real email capture functionality
- [ ] Add conversion tracking to deployment
  - Track completion rates by stage, time spent, email capture rate
  - Essential for proving product-market fit
- [ ] Move A/B testing framework from technical debt to high priority
  - Test different messages, timings, and flows
  - Critical for optimization
- [ ] Implement user feedback loop system
  - "Did you watch it? Did you like it?" post-recommendation tracking
  - Foundation for future recommendation engine
- [ ] Mobile-first responsive optimization
  - Target audience (25-35 professionals) primarily uses mobile
  - Current desktop-focused experience limits reach
- [ ] Integrate with 1-2 streaming platform APIs for MVP
  - Add real "watch now" links for conversion tracking
  - Critical for future affiliate revenue model

### In Progress

- [ ] Improve UI/UX of the Experience Decision Overload section (ongoing refinements)

### Completed Today (2025-06-12)

- [x] Fixed viewport overflow issues in DecisionOverloadSimulation
  - Implemented dynamic grid layout calculation based on real viewport dimensions
  - Added SSR protection for window object access
  - Prevented scrollbars and content shifting at all card counts
- [x] Optimized handleSmoothTransition() render logic
  - Added proper timeout cleanup to prevent memory leaks
  - Implemented useRef for timeout tracking
  - Added component unmount cleanup
- [x] Enhanced card shuffle animation system
  - Maintained 1.3s duration with 20-60px scatter distance
  - Preserved true spatial movement and physics-based deceleration
  - Fixed grid positioning calculations for new layout system
- [x] Implemented click limits and viewport constraints
  - Maximum 15 clicks allowed
  - Hard cap of 96 options total
  - Dynamic card sizing based on viewport space
- [x] Added early overwhelm escape mechanism
  - "Feeling overwhelmed yet?" link appears at 10 clicks
  - Progressively increasing glow effect on each subsequent click
  - Larger text size with red coloring
- [x] Implemented inactivity-based overwhelm button
  - Appears after 4+ clicks AND 10 seconds of inactivity
  - Resets when user clicks again
  - Provides alternative escape route before 15 clicks
- [x] Fixed TypeScript and build compliance
  - Resolved SSR window object error
  - Ensured all builds pass without warnings
  - Maintained ESLint compliance

## Development Decisions & Rationale

### Viewport-Constrained Grid System

**Decision**: Dynamic grid layout that scales based on actual viewport dimensions
**Rationale**:

- Prevents scrollbars and content overflow at all screen sizes
- Maintains usability across different devices and window sizes
- Provides consistent experience regardless of card count
- Automatically adjusts columns and card sizes to fit available space

### Multi-Tier Overwhelm Detection

**Decision**: Three-tier system for overwhelm detection
**Rationale**:

1. **Early Warning (10+ clicks)**: Glowing "Feeling overwhelmed yet?" link
2. **Inactivity Detection (4+ clicks + 10s pause)**: Automatic overwhelm button
3. **Threshold Detection (15+ clicks)**: Traditional overwhelm button

- Accommodates different user behaviors and decision-making patterns
- Provides multiple escape routes to prevent user frustration

### Click and Content Limits

**Decision**: Maximum 15 clicks and 96 total options
**Rationale**:

- Prevents infinite grid growth that could break layout
- Creates natural stopping point for simulation
- Maintains performance with reasonable DOM size
- Forces grid optimization within realistic constraints

### Data Structure Enhancement

**Decision**: Expanded streaming options from simple title/subtitle to comprehensive metadata
**Rationale**: Provides more realistic simulation of actual streaming platforms, increases cognitive load authentically

### Rating Badge Implementation

**Decision**: Color-coded rating badges in bottom-right corner
**Rationale**:

- Red for mature (TV-MA, R)
- Orange for teen (TV-14, PG-13)
- Yellow for guidance (TV-PG, PG)
- Green for kids (TV-Y, G)
- Matches industry standards for quick recognition

### Auto-Progression Logic

**Decision**: 10-second delay after "I'm Overwhelmed!" button appears at 75% threshold
**Rationale**: Balances user agency with ensuring experience progression

## Recurring Issues & Solutions

### Issue: Viewport overflow causing scrollbars

**Solution**: Implemented real-time viewport dimension checking with dynamic grid layout calculation
**Prevention**: Always check actual available space before rendering grid, use SSR guards for window object
**Status**: Resolved

### Issue: Memory leaks from setTimeout in transitions

**Solution**: Added useRef timeout tracking with proper cleanup on component unmount
**Prevention**: Always store timeout IDs and clear them in cleanup functions
**Status**: Resolved

### Issue: Server-side rendering errors with window object

**Solution**: Added `typeof window === 'undefined'` guards before accessing window properties
**Prevention**: Always check for browser environment before using browser-only APIs
**Status**: Resolved

### Issue: Bubble count decreasing on click

**Solution**: Removed setTimeout delay in click handler, made all operations synchronous
**Prevention**: Always consider race conditions when mixing async operations with state updates
**Status**: Resolved

### Issue: Firefox camera hanging

**Solution**: Switched from custom hook to react-webcam library
**Status**: Resolved

## Technical Debt

- [ ] Consider lazy loading for 100+ streaming options
- [ ] Add error boundaries for camera failures
- [ ] Implement analytics tracking for user journey
- [ ] Add A/B testing framework for conversion optimization
- [ ] Consider WebGL for bubble animations at scale

### Low Priority

- [ ] Fine-tune card shuffle animation timing and easing
  - Current implementation shuffles cards after each click
  - May need adjustment if it feels too distracting or jarring
  - Consider A/B testing with/without shuffle effect

## Code Audit Reminders

- [ ] Review all TypeScript types for consistency
- [ ] Check accessibility compliance (WCAG 2.1)
- [ ] Performance audit with Lighthouse
- [ ] Security review of camera permissions
- [ ] Cross-browser testing (Safari, Edge)

## Upcoming Features

- [ ] Sound design elements for bubble interactions
- [ ] Advanced webcam effects (blur, filters)
- [ ] Social sharing functionality
- [ ] Email capture optimization
- [ ] Mobile gesture support

## Notes

- STREAMING_OPTIONS expanded from 24 to 100+ items
- Bubble threshold range: 74-92 (random per session)
- All buttons use consistent `rounded-lg` border radius
- Gradient animation uses 3-second cycle time
- Transition overlay uses 4-6 second random delay

## Dependencies to Monitor

- next: 14.2.13
- react-webcam: ^7.2.0
- tailwindcss: ^3.4.17
- typescript: ^5

Last updated: 2025-06-12
