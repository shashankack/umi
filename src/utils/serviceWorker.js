// Service Worker registration utility
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content available, prompt user to refresh
              if (confirm("New version available! Refresh to update?")) {
                window.location.reload();
              }
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

// Utility to check if app is running in standalone mode (PWA)
export const isStandalone = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  );
};

// Install prompt handling
export const handleInstallPrompt = () => {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install button
    const installButton = document.getElementById("install-button");
    if (installButton) {
      installButton.style.display = "block";
      installButton.addEventListener("click", async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          deferredPrompt = null;
          installButton.style.display = "none";
        }
      });
    }
  });
};
