# Guided Tour Implementation with Shepherd.js

This implementation provides a comprehensive guided walkthrough for first-time users who have just registered on the Story Generator platform.

## Features

- **Automatic Trigger**: Tour starts automatically for newly registered users
- **Interactive Steps**: 7-step tour covering all major features
- **Responsive Design**: Works on all screen sizes
- **Skip Option**: Users can skip the tour at any time
- **Persistence**: Tour completion status is saved in localStorage
- **Navigation Integration**: Seamlessly navigates between pages during the tour

## Installation

1. Install Shepherd.js:
```bash
npm install shepherd.js
```

2. The guided tour components are already integrated into your app structure.

## Components

### 1. OnboardingContext (`src/contexts/OnboardingContext.jsx`)
Manages the state of first-time users and tour completion status.

**Key Functions:**
- `markUserAsRegistered()`: Call after successful user registration
- `completeTour()`: Mark tour as completed
- `resetTour()`: Reset tour for testing
- `triggerTour()`: Manually start the tour

### 2. GuidedTour (`src/components/onboarding/GuidedTour.jsx`)
Main tour component using Shepherd.js.

**Tour Steps:**
1. **Welcome**: Introduction and tour overview
2. **Navigation Bar**: Overview of main navigation
3. **Create Story**: Guide to story creation
4. **Generate Story Help**: AI-powered story generation feature
5. **My Stories**: Personal story management
6. **Explore**: Community story discovery
7. **Profile**: Account management
8. **Story Segmentation**: Breaking stories into scenes
9. **Media Generation**: Creating images and audio
10. **Export & Share**: Downloading and sharing stories
11. **Completion**: Final summary and next steps

### 3. TourTrigger (`src/components/onboarding/TourTrigger.jsx`)
Enhanced testing component with improved design and user experience.

### 4. FloatingTourButton (`src/components/onboarding/FloatingTourButton.jsx`)
Floating tour button with hover tooltip and status indicator for use across the app.

## Tour Button Options

### 1. Inline Tour Buttons (StoryInput.jsx)
- **Primary Tour Button**: Gradient blue button with "Take Tour" text
- **Reset Button**: Secondary button for resetting tour state
- **Features**: Hover effects, tooltips, and smooth animations

### 2. Floating Tour Button (FloatingTourButton.jsx)
- **Circular Design**: Round button with gradient background
- **Hover Tooltip**: Expands to show tour information and options
- **Notification Badge**: Red "!" badge for new users
- **Status Indicator**: Shows tour completion status
- **Animations**: Pulse effect and scale transforms

### 3. Enhanced TourTrigger (TourTrigger.jsx)
- **Large Button**: Prominent design with descriptive text
- **Animated Elements**: Pulse effects and bounce animations
- **Status Display**: Visual indicator of tour completion
- **Responsive Design**: Adapts to different screen sizes

## Integration

### Automatic Integration
The tour is automatically integrated into your main App component:

```jsx
// App.jsx
import { OnboardingProvider } from './contexts/OnboardingContext'
import GuidedTour from './components/onboarding/GuidedTour'

function App() {
  return (
    <OnboardingProvider>
      <Router>
        <AppContent />
        <GuidedTour />
      </Router>
    </OnboardingProvider>
  )
}
```

### Registration Integration
The SignUp component automatically triggers the tour for new users:

```jsx
// SignUp.jsx
import { useOnboarding } from '../../contexts/OnboardingContext'

const SignUp = () => {
  const { markUserAsRegistered } = useOnboarding()
  
  const handleSubmit = async (e) => {
    // ... registration logic ...
    
    // After successful registration
    markUserAsRegistered()
    navigate('/create')
  }
}
```

## Customization

### Adding New Steps
To add new tour steps, modify the `GuidedTour.jsx` component:

```jsx
tour.addStep({
  id: 'new-step',
  attachTo: {
    element: '.your-element-selector',
    on: 'bottom'
  },
  text: `
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">New Feature</h3>
      <p class="text-gray-600">Description of the new feature.</p>
    </div>
  `,
  buttons: [
    {
      text: 'Previous',
      action: tour.back,
      classes: 'bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded'
    },
    {
      text: 'Next',
      action: tour.next,
      classes: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
    }
  ]
})
```

### Styling
The tour uses Tailwind CSS classes for styling. You can customize the appearance by modifying the `classes` property in step options.

### Tour Configuration
Modify the tour configuration in `GuidedTour.jsx`:

```jsx
const tour = new Shepherd.Tour({
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    classes: 'shadow-md bg-white rounded-lg',
    scrollTo: true
  },
  useModalOverlay: true
})
```

## Testing

### Development Testing
Add the `TourTrigger` component to any page for testing:

```jsx
import TourTrigger from './components/onboarding/TourTrigger'

// Add to your component
<TourTrigger />
```

### Manual Testing
1. Clear localStorage: `localStorage.clear()`
2. Register a new user
3. The tour should start automatically

### Reset Tour
Use the context function to reset the tour:

```jsx
const { resetTour } = useOnboarding()
resetTour()
```

## Browser Compatibility

Shepherd.js supports all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- Shepherd.js is loaded dynamically only when needed
- Tour state is managed efficiently with React context
- Minimal impact on app performance

## Troubleshooting

### Tour Not Starting
1. Check if `isFirstTimeUser` is true in the context
2. Verify Shepherd.js is installed: `npm list shepherd.js`
3. Check browser console for errors

### Elements Not Found
1. Ensure element selectors match your HTML structure
2. Add appropriate CSS classes to elements
3. Check if elements are rendered before tour starts

### Styling Issues
1. Verify Shepherd.js CSS is imported
2. Check for CSS conflicts with your existing styles
3. Use browser dev tools to inspect tour elements

## Future Enhancements

- **Multi-language Support**: Add translations for tour content
- **Progressive Disclosure**: Show different tours based on user progress
- **Analytics Integration**: Track tour completion rates
- **Custom Themes**: Allow users to choose tour appearance
- **Contextual Help**: Show relevant tours based on user actions

## Dependencies

- `shepherd.js`: Core tour functionality
- `react-router-dom`: Navigation during tour
- `react`: React hooks and context

## License

This implementation follows the same license as your main project. 