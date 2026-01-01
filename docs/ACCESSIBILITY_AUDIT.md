# Accessibility Audit Checklist

## Keyboard Navigation

- [ ] All interactive elements focusable
- [ ] Focus visible on all elements
- [ ] Tab order logical
- [ ] Skip to content link
- [ ] Escape closes modals/drawers

## Form Accessibility

- [ ] All inputs have labels
- [ ] Required fields indicated
- [ ] Error messages linked to inputs
- [ ] Autocomplete attributes set
- [ ] Form submission feedback

## Color & Contrast

- [ ] Text contrast ≥ 4.5:1 (normal text)
- [ ] Large text contrast ≥ 3:1
- [ ] UI components contrast ≥ 3:1
- [ ] No color-only information
- [ ] Focus indicators visible

## Screen Readers

- [ ] Images have alt text
- [ ] Icons have aria-labels
- [ ] Dynamic content announced
- [ ] Tables have headers
- [ ] Lists properly structured

## Touch Targets

- [ ] Minimum 44x44px touch targets
- [ ] Adequate spacing between targets
- [ ] No tiny buttons or links

## Motion & Animation

- [ ] Reduced motion preference respected
- [ ] No auto-playing videos
- [ ] Animations can be paused

## Status Checks

| Page       | Keyboard | Labels | Contrast | Status |
| ---------- | -------- | ------ | -------- | ------ |
| Dashboard  | ☐        | ☐      | ☐        |        |
| Inbox      | ☐        | ☐      | ☐        |        |
| Orders     | ☐        | ☐      | ☐        |        |
| Products   | ☐        | ☐      | ☐        |        |
| Settings   | ☐        | ☐      | ☐        |        |
| Checkout   | ☐        | ☐      | ☐        |        |
| Storefront | ☐        | ☐      | ☐        |        |

## Tools Used

- [ ] axe DevTools scan
- [ ] Lighthouse accessibility audit
- [ ] Manual keyboard testing
- [ ] Screen reader testing (NVDA/VoiceOver)
