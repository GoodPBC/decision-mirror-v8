# Product Requirements - Decision Mirror

**Date**: 2025-06-12

## Product Overview

The Decision Mirror is an interactive web experience that demonstrates decision fatigue through a progressive narrative flow, ultimately converting users to the Decision Layer product.

## Core Requirements

### User Experience Flow

1. **Landing/Intro** - Promise of "first-of-its-kind experience"
2. **Camera Permission** - Personal connection through webcam (with fallback)
3. **Visualization** - Floating decision bubbles accumulating around user
4. **Simulation** - Interactive streaming choice overload
5. **Realization** - Quantified impact of decision fatigue
6. **Solution** - Product introduction and conversion CTA

### Technical Requirements

#### Frontend

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Webcam for camera integration
- Responsive design (mobile-first)

#### Performance

- 20 FPS minimum for animations
- <1s response time for interactions
- Progressive loading for large datasets
- Optimized bundle size

#### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### Feature Specifications

#### Decision Bubbles

- Minimum 173 unique decision texts
- 3-7 bubble spawn clusters
- 74-92 random threshold range
- Progressive intensity (low→medium→high)
- Click interaction spawns 4-6 new bubbles
- 80% opacity for all bubbles

#### Streaming Simulation

- 100+ streaming options with metadata
- Progressive loading (8 initial, +4 per click)
- Rating badges with color coding
- Genre, format, network display
- 15-click overwhelm threshold

#### User Agency

- "I'm Overwhelmed!" button at 75% threshold
- 10-second auto-progression backup
- Manual continue button (50% threshold required)
- Skip camera option

### Design System

#### Colors

- Primary gradient: blue→purple→pink→indigo→cyan→violet
- Background: gray-900 to black gradient
- Text: White primary, gray-300/400/500 secondary
- Ratings: Red (mature), Orange (teen), Yellow (guidance), Green (kids)

#### Typography

- All buttons: font-normal weight
- Headers: text-3xl to text-5xl
- Body: text-sm to text-lg
- Consistent rounded-lg borders

#### Animation

- 3-second gradient shift cycle
- 4-6 second transition delays
- Smooth hover effects (scale-105)
- Fade-in animations for text

### Conversion Requirements

#### Psychology Triggers

- Personal investment (camera)
- Progressive overwhelm
- Concrete quantification
- Emotional relief at solution
- Social proof ("be among the first")

#### Data Tracking

- Time spent per stage
- Camera enabled/disabled
- Click counts
- Options viewed
- Total experience time

### Privacy & Security

- No data persistence
- Camera permissions transparent
- Fallback for all features
- No external analytics

## Success Metrics

### Primary KPIs

- Conversion rate to signup
- Experience completion rate
- Time to conversion
- Sharing/viral coefficient

### Secondary KPIs

- Camera permission grant rate
- Average bubbles before overwhelm
- Simulation interaction depth
- Device/browser distribution

## Future Enhancements

- Sound design elements
- Advanced webcam effects
- A/B testing framework
- Email capture optimization
- Social sharing features
- Multi-language support

## Technical Constraints

- No backend required (static site)
- Client-side only processing
- Bundle size <500KB
- No external dependencies for core features

## Accessibility Requirements

- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion options
- Alt text for all images

Last updated: 2025-01-12
