import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../contexts/OnboardingContext';

const GuidedTour = () => {
  const navigate = useNavigate();
  const tourRef = useRef(null);
  const { isFirstTimeUser, completeTour } = useOnboarding();

  useEffect(() => {
    if (!isFirstTimeUser) return;

    // Import Shepherd.js dynamically
    import('shepherd.js').then(({ default: Shepherd }) => {
      // Import Shepherd styles
      import('shepherd.js/dist/css/shepherd.css');

      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'shadow-md bg-white rounded-lg',
          scrollTo: true
        },
        useModalOverlay: true
      });

      // Step 1: Welcome message
      tour.addStep({
        id: 'welcome',
        text: `
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Welcome to Story Generator! 🎉</h3>
            <p class="text-gray-600">Let's take a quick tour to help you get started with creating amazing stories.</p>
          </div>
        `,
        buttons: [
          {
            text: 'Skip Tour',
            action: () => {
              completeTour();
              tour.complete();
            },
            classes: 'bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded'
          },
          {
            text: 'Start Tour',
            action: tour.next,
            classes: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
          }
        ]
      });

      // Step 2: Navigation bar
      tour.addStep({
        id: 'navbar',
        attachTo: {
          element: '.navbar',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Navigation Bar</h3>
            <p class="text-gray-600">Here you can access all the main features:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>Create:</strong> Start a new story</li>
              <li>• <strong>My Stories:</strong> View your created stories</li>
              <li>• <strong>Explore:</strong> Discover stories from other users</li>
              <li>• <strong>Profile:</strong> Manage your account</li>
            </ul>
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
      });

      // Step 3: Create Story button
      tour.addStep({
        id: 'create-story',
        attachTo: {
          element: '[href="/create"], .create-story-btn',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Create Your First Story</h3>
            <p class="text-gray-600">Click here to start creating your own unique story. You can:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Choose from various story genres</li>
              <li>• Set story length and style</li>
              <li>• Add custom characters and settings</li>
              <li>• Generate AI-powered content</li>
            </ul>
          </div>
        `,
        buttons: [
          {
            text: 'Previous',
            action: tour.back,
            classes: 'bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded'
          },
          {
            text: 'Try It Now',
            action: () => {
              navigate('/create');
              tour.next();
            },
            classes: 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
          }
        ]
      });

      // Step 4: Generate Story Help
      tour.addStep({
        id: 'generate-story-help',
        attachTo: {
          element: 'button[title*="help"], button[title*="started"]',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Need Help Getting Started? 🤖</h3>
            <p class="text-gray-600">Don't know what to write? Click this help button to:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>Generate Story Ideas:</strong> Get AI-powered story suggestions</li>
              <li>• <strong>Auto-complete:</strong> Let AI create a title and content for you</li>
              <li>• <strong>Overcome Writer's Block:</strong> Perfect when you're stuck</li>
              <li>• <strong>Quick Start:</strong> Jump into writing immediately</li>
            </ul>
            <div class="bg-blue-50 p-3 rounded-lg mt-3">
              <p class="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Use this feature to get inspiration, then customize the generated content to make it your own!
              </p>
            </div>
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
      });

      // Step 5: My Stories section
      tour.addStep({
        id: 'my-stories',
        attachTo: {
          element: '[href="/my-stories"], .my-stories-btn',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">My Stories</h3>
            <p class="text-gray-600">This is where all your created stories will be stored. You can:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• View all your stories in one place</li>
              <li>• Edit and continue unfinished stories</li>
              <li>• Share your stories with others</li>
              <li>• Generate media for your stories</li>
            </ul>
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
      });

      // Step 6: Explore section
      tour.addStep({
        id: 'explore',
        attachTo: {
          element: '[href="/explore"], .explore-btn',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Explore Stories</h3>
            <p class="text-gray-600">Discover amazing stories created by our community:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Browse stories by genre and popularity</li>
              <li>• Get inspiration for your own stories</li>
              <li>• Like and comment on stories you enjoy</li>
              <li>• Follow your favorite authors</li>
            </ul>
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
      });

      // Step 7: Profile section
      tour.addStep({
        id: 'profile',
        attachTo: {
          element: '[href="/profile"], .profile-btn',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Your Profile</h3>
            <p class="text-gray-600">Manage your account and preferences:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Update your profile information</li>
              <li>• Manage your subscription</li>
              <li>• View your generated content</li>
              <li>• Access account settings</li>
            </ul>
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
      });

      // Step 8: Story Segmentation
      tour.addStep({
        id: 'story-segmentation',
        attachTo: {
          element: '.segment-story-btn, [data-tour="segment-story"]',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Story Segmentation</h3>
            <p class="text-gray-600">After saving your story, you can break it down into scenes:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>Auto-segment:</strong> Let AI break your story into logical scenes</li>
              <li>• <strong>Manual editing:</strong> Review and modify scene descriptions</li>
              <li>• <strong>Scene management:</strong> Add, edit, or delete individual scenes</li>
              <li>• <strong>Scene preview:</strong> See how your story flows as scenes</li>
            </ul>
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
      });

      // Step 9: Media Generation
      tour.addStep({
        id: 'media-generation',
        attachTo: {
          element: '.media-generation-btn, [data-tour="media-generation"]',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Media Generation</h3>
            <p class="text-gray-600">Bring your story to life with AI-generated media:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>Images:</strong> Generate visual scenes for each part of your story</li>
              <li>• <strong>Audio:</strong> Create narrated audio versions with different voices</li>
              <li>• <strong>Bulk generation:</strong> Generate media for all scenes at once</li>
              <li>• <strong>Voice selection:</strong> Choose from various narrator voices</li>
            </ul>
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
      });

      // Step 10: Export and Share
      tour.addStep({
        id: 'export-share',
        attachTo: {
          element: '.export-btn, [data-tour="export-share"]',
          on: 'bottom'
        },
        text: `
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Export & Share</h3>
            <p class="text-gray-600">Share your completed story with the world:</p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>PDF Export:</strong> Download your story as a beautiful PDF</li>
              <li>• <strong>Audio Books:</strong> Create narrated audio versions</li>
              <li>• <strong>Social Sharing:</strong> Share on social media platforms</li>
              <li>• <strong>Public Library:</strong> Add your story to the community</li>
            </ul>
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
      });

      // Step 11: Final step (updated)
      tour.addStep({
        id: 'complete',
        text: `
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-800 mb-2">You're All Set! 🚀</h3>
            <p class="text-gray-600 mb-4">You now know the complete Story Generator workflow:</p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
              <p class="text-sm text-blue-800 font-medium">Complete Workflow:</p>
              <ol class="text-sm text-blue-700 mt-2 space-y-1 text-left">
                <li>1. Create your story</li>
                <li>2. Segment into scenes</li>
                <li>3. Generate media (images & audio)</li>
                <li>4. Export and share</li>
              </ol>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-green-800">
                <strong>Pro Tip:</strong> Start with a simple story, then experiment with different media types to create something truly unique!
              </p>
            </div>
          </div>
        `,
        buttons: [
          {
            text: 'Start Creating',
            action: () => {
              completeTour();
              navigate('/create');
              tour.complete();
            },
            classes: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded'
          }
        ]
      });

      // Store tour reference
      tourRef.current = tour;

      // Start the tour
      tour.start();

      // Cleanup function
      return () => {
        if (tourRef.current) {
          tourRef.current.complete();
        }
      };
    });
  }, [isFirstTimeUser, navigate, completeTour]);

  return null; // This component doesn't render anything visible
};

export default GuidedTour; 