import { createStandaloneApplication } from './standalone/application.js';
import { describeError } from './standalone/errors.js';

// DIAGNOSTIC: Log environment variables before app creation
console.log('[AppStartup] Environment check:', {
  GOOGLE_MAPS_API_KEY: import.meta.env.GOOGLE_MAPS_API_KEY ? '(set)' : '(undefined)',
  CESIUM_ION_TOKEN: import.meta.env.CESIUM_ION_TOKEN ? '(set)' : '(undefined)',
  DEV: import.meta.env.DEV,
});

// DIAGNOSTIC: Verify loading screen exists
const loadingScreen = document.getElementById('loading-screen');
console.log('[AppStartup] Loading screen element:', loadingScreen ? 'found' : 'MISSING');
if (loadingScreen) {
  const loaderStatus = loadingScreen.querySelector('.loader-status');
  console.log('[AppStartup] Loader status element:', loaderStatus ? 'found' : 'MISSING');
}

const application = createStandaloneApplication({
  googleApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
  cesiumToken: import.meta.env.CESIUM_ION_TOKEN,
  allowQaRegistration: import.meta.env.DEV,
});

console.log('[AppStartup] Application created, starting...');

application.start().then((components) => {
  console.log('[AppStartup] Application started successfully!', {
    scene: !!components.scene,
    controls: !!components.controls,
    data: !!components.data,
    tools: !!components.tools,
    viewer: components.scene?.viewer ? 'present' : 'missing',
    tileset: components.scene?.tileset ? 'present' : 'missing',
  });
}).catch((error) => {
  console.error("God's Eye View initialization failed:", error);
  const loaderStatus = document.querySelector('#loading-screen .loader-status');
  if (loaderStatus) {
    loaderStatus.textContent = `Error: ${describeError(error)}`;
    loaderStatus.style.color = '#ff4444';
  }
});

export { application };
