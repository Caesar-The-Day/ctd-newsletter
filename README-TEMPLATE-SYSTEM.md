# Caesar the Day - Multi-Region Template System

## Overview

This project is a **template system** for creating regional newsletters about retirement destinations. The `main` branch serves as the source of truth, while individual newsletter deployments live on separate branches.

## Directory Structure

```
/public/data/
  ├── config/
  │   ├── feature-flags.json      # Control optional sections per region
  │   └── section-order.json      # Customize section ordering
  ├── regions/
  │   └── italy/
  │       ├── piemonte.json
  │       └── piemonte-climate.json
  ├── _template.json              # Comprehensive template with inline docs
  ├── _CONTENT-GUIDE.md          # Step-by-step content creation guide
  └── globals.json                # Site-wide configuration

/public/images/
  ├── shared/                     # Global assets (logo, portraits, etc.)
  └── {country}-{region}/         # Region-specific images
```

## Quick Start: Create New Newsletter

1. **Create branch from main**:
   ```bash
   git checkout main && git pull
   git checkout -b calabria-newsletter-live
   ```

2. **Copy template**:
   ```bash
   cp public/data/_template.json public/data/regions/italy/calabria.json
   ```

3. **Create image directory**:
   ```bash
   mkdir public/images/italy-calabria
   ```

4. **Populate content** following `_CONTENT-GUIDE.md`

5. **Update default route** in `src/pages/Index.tsx`:
   ```typescript
   navigate('/calabria'); // Change from '/piemonte'
   ```

6. **Test locally**: `npm run dev`

7. **Push and deploy** to Vercel from your branch

## Branch Strategy

- **`main`**: Template source (DO NOT DEPLOY)
- **`piemonte-newsletter-live`**: Piemonte newsletter (deployed)
- **`calabria-newsletter-live`**: Calabria newsletter (future)
- **`provence-newsletter-live`**: Provence newsletter (future)

## Customization Points

### Easy (JSON Configuration)
- Feature flags: Enable/disable sections
- Section ordering: Rearrange content flow
- Content: All text, images, data via JSON

### Medium (Component Props)
- Add custom highlight categories beyond Wine/Food/Culture
- Modify cost calculator presets
- Add new town types

### Advanced (Code Changes)
- Create new section components
- Modify styling/layout
- Add new data visualization

## Feature Flags

Control optional sections in `/public/data/config/feature-flags.json`:

```json
{
  "showWineQuiz": true,           // Wine personality quiz
  "show7PercentCTA": true,        // 7% tax advantage CTA
  "showCollaborator": true,       // Partner feature section
  "showBookCTA": true,            // Escape Plan book promo
  "showRetirementBlueprintCTA": true,  // Consultation CTA
  "enableAmbientAudio": true,     // Hero audio
  "enableSeasonalParticles": true // Visual effects
}
```

## Documentation

- **`_template.json`**: Comprehensive JSON template with inline documentation
- **`_CONTENT-GUIDE.md`**: Step-by-step content creation workflow
- **`DEPLOYMENT.md`**: Deployment and branch management guide
- **`NEWSLETTER-QA.md`**: Quality assurance checklist

## Testing Checklist

Before committing:
- [ ] All images load from correct paths
- [ ] No console errors
- [ ] Map markers display correctly
- [ ] Cost calculator functions with all presets
- [ ] Feature flags work as expected
- [ ] Responsive design intact
- [ ] All external links work

## Updating the Template

To improve the template for all future newsletters:

1. Make changes on `main` branch
2. Test thoroughly with existing newsletter (Piemonte)
3. Document changes in this README
4. Merge `main` into live newsletter branches when ready
5. Handle conflicts (usually just `Index.tsx` route)

## Support

- Template issues: Create GitHub issue
- Content questions: Consult `_CONTENT-GUIDE.md`
- Technical questions: Check component documentation
