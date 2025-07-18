/**
 * Theme Utility Functions
 * Provides centralized theme management for the UAV application
 */

class ThemeUtils {
    constructor() {
        this.STORAGE_KEY = "uav-theme";
        this.THEME_CLASSES = {
            LIGHT: "light-theme",
            DARK: "dark-theme",
        };
        this.THEME_VALUES = {
            LIGHT: "light",
            DARK: "dark",
            AUTO: "auto",
        };
        this.mediaQuery = null;
        this.listeners = [];
    }

    /**
     * Initialize theme system
     */
    init() {
        const savedTheme = this.getStoredTheme();
        this.applyTheme(savedTheme);

        // Set up system preference listener
        this.setupMediaQueryListener();
    }

    /**
     * Get stored theme from localStorage
     */
    getStoredTheme() {
        return (
            localStorage.getItem(this.STORAGE_KEY) || this.THEME_VALUES.LIGHT
        );
    }

    /**
     * Store theme in localStorage
     */
    setStoredTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    /**
     * Apply theme to document body
     */
    applyTheme(theme) {
        const body = document.body;

        // Add transitioning class for smooth animation
        body.classList.add("theme-changing");

        // Remove existing theme classes
        body.classList.remove(
            this.THEME_CLASSES.LIGHT,
            this.THEME_CLASSES.DARK
        );

        // Apply new theme
        switch (theme) {
            case this.THEME_VALUES.DARK:
                body.classList.add(this.THEME_CLASSES.DARK);
                break;
            case this.THEME_VALUES.LIGHT:
                body.classList.add(this.THEME_CLASSES.LIGHT);
                break;
            case this.THEME_VALUES.AUTO:
                this.applyAutoTheme();
                break;
            default:
                body.classList.add(this.THEME_CLASSES.LIGHT);
        }

        // Store theme preference
        this.setStoredTheme(theme);

        // Remove transitioning class after animation
        setTimeout(() => {
            body.classList.remove("theme-changing");
        }, 300);

        // Notify listeners
        this.notifyListeners(theme);
    }

    /**
     * Apply theme based on system preference
     */
    applyAutoTheme() {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const body = document.body;

        // Add transitioning class for smooth animation
        body.classList.add("theme-changing");

        body.classList.remove(
            this.THEME_CLASSES.LIGHT,
            this.THEME_CLASSES.DARK
        );
        body.classList.add(
            prefersDark ? this.THEME_CLASSES.DARK : this.THEME_CLASSES.LIGHT
        );

        // Remove transitioning class after animation
        setTimeout(() => {
            body.classList.remove("theme-changing");
        }, 300);
    }

    /**
     * Setup media query listener for system theme changes
     */
    setupMediaQueryListener() {
        this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        this.mediaQuery.addEventListener("change", (e) => {
            const currentTheme = this.getStoredTheme();
            if (currentTheme === this.THEME_VALUES.AUTO) {
                this.applyAutoTheme();
                this.notifyListeners(currentTheme);
            }
        });
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = this.getStoredTheme();
        const newTheme =
            currentTheme === this.THEME_VALUES.LIGHT
                ? this.THEME_VALUES.DARK
                : this.THEME_VALUES.LIGHT;

        this.applyTheme(newTheme);
        return newTheme;
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.getStoredTheme();
    }

    /**
     * Check if current theme is dark
     */
    isDarkTheme() {
        const theme = this.getStoredTheme();
        if (theme === this.THEME_VALUES.DARK) {
            return true;
        }
        if (theme === this.THEME_VALUES.AUTO) {
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    }

    /**
     * Get theme display name
     */
    getThemeDisplayName(theme) {
        switch (theme) {
            case this.THEME_VALUES.LIGHT:
                return "☀️ Light Theme";
            case this.THEME_VALUES.DARK:
                return "🌙 Dark Theme";
            case this.THEME_VALUES.AUTO:
                return "🌗 Auto (System)";
            default:
                return "☀️ Light Theme";
        }
    }

    /**
     * Get theme icon
     */
    getThemeIcon(theme) {
        switch (theme) {
            case this.THEME_VALUES.LIGHT:
                return "fas fa-sun";
            case this.THEME_VALUES.DARK:
                return "fas fa-moon";
            case this.THEME_VALUES.AUTO:
                return "fas fa-adjust";
            default:
                return "fas fa-sun";
        }
    }

    /**
     * Add theme change listener
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove theme change listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(
            (listener) => listener !== callback
        );
    }

    /**
     * Notify all listeners of theme change
     */
    notifyListeners(theme) {
        this.listeners.forEach((callback) => {
            try {
                callback(theme);
            } catch (error) {
                console.error("Theme listener error:", error);
            }
        });
    }

    /**
     * Get available themes
     */
    getAvailableThemes() {
        return [
            {
                value: this.THEME_VALUES.LIGHT,
                label: this.getThemeDisplayName(this.THEME_VALUES.LIGHT),
                icon: this.getThemeIcon(this.THEME_VALUES.LIGHT),
            },
            {
                value: this.THEME_VALUES.DARK,
                label: this.getThemeDisplayName(this.THEME_VALUES.DARK),
                icon: this.getThemeIcon(this.THEME_VALUES.DARK),
            },
            {
                value: this.THEME_VALUES.AUTO,
                label: this.getThemeDisplayName(this.THEME_VALUES.AUTO),
                icon: this.getThemeIcon(this.THEME_VALUES.AUTO),
            },
        ];
    }

    /**
     * Cleanup - remove listeners
     */
    cleanup() {
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener(
                "change",
                this.handleSystemThemeChange
            );
        }
        this.listeners = [];
    }
}

// Create singleton instance
const themeUtils = new ThemeUtils();

export default themeUtils;
