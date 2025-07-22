import React, { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import themeUtils from "../../utils/ThemeUtils";
import { FormattedMessage } from "react-intl";
import "./Settings.css";

class Settings extends Component {
    constructor(props) {
        super(props);

        // Load theme from localStorage or default to light
        const savedTheme = themeUtils.getStoredTheme();

        this.state = {
            activeTab: "general",
            currentTheme: savedTheme, // Add currentTheme to state
            settings: {
                // General Settings
                language: "en",
                theme: savedTheme,
                timezone: "UTC+7",
                notifications: true,
                autoSave: true,

                // UAV Settings
                maxFlightTime: 60,
                maxSpeed: 100,
                maxAltitude: 400,
                lowBatteryWarning: 20,

                // Map Settings
                mapProvider: "openstreetmap",
                defaultZoom: 10,
                showTraffic: false,
                showWeather: true,

                // Privacy Settings
                dataSharing: false,
                analyticsTracking: false,
                crashReporting: true,

                // Advanced Settings
                debugMode: false,
                logLevel: "info",
                cacheSize: 500,
                autoUpdate: true,
            },
        };
    }

    componentDidMount() {
        // Initialize theme system
        themeUtils.init();

        // Apply initial theme to body classes and data-theme
        const currentTheme = themeUtils.getCurrentTheme();
        this.applyThemeToDocument(currentTheme);

        // Add theme change listener
        this.handleThemeChange = () => {
            const newTheme = themeUtils.getCurrentTheme();
            this.applyThemeToDocument(newTheme);

            this.setState({
                currentTheme: newTheme,
                settings: {
                    ...this.state.settings,
                    theme: newTheme,
                },
            });
        };

        themeUtils.addListener(this.handleThemeChange);
    }

    applyThemeToDocument = (theme) => {
        // Use requestAnimationFrame for instant DOM updates
        requestAnimationFrame(() => {
            const body = document.body;
            const html = document.documentElement;

            // Remove existing theme classes and attributes instantly
            body.className = body.className
                .replace(/light-theme|dark-theme/g, "")
                .trim();
            html.className = html.className
                .replace(/light-theme|dark-theme/g, "")
                .trim();

            body.removeAttribute("data-theme");
            html.removeAttribute("data-theme");

            // Apply new theme instantly
            if (theme === "dark") {
                body.classList.add("dark-theme");
                body.setAttribute("data-theme", "dark");
                html.classList.add("dark-theme");
                html.setAttribute("data-theme", "dark");
            } else {
                body.classList.add("light-theme");
                body.setAttribute("data-theme", "light");
                html.classList.add("light-theme");
                html.setAttribute("data-theme", "light");
            }
        });
    };

    componentWillUnmount() {
        // Remove theme change listener
        if (themeUtils.removeListener) {
            themeUtils.removeListener(this.handleThemeChange);
        }
    }

    handleThemeChange = (theme) => {
        // This method is no longer needed since we handle it in componentDidMount
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    handleSettingChange = (key, value) => {
        // Apply theme immediately when theme setting changes - before setState
        if (key === "theme") {
            this.applyThemeToDocument(value);
            themeUtils.applyTheme(value);
        }

        this.setState((prevState) => ({
            currentTheme: key === "theme" ? value : prevState.currentTheme,
            settings: {
                ...prevState.settings,
                [key]: value,
            },
        }));
    };

    handleSave = () => {
        // Simulate saving settings
        console.log("Settings saved:", this.state.settings);
        // Show success message
        alert("Settings saved successfully!");
    };

    handleReset = () => {
        if (
            window.confirm(
                "Are you sure you want to reset all settings to default?"
            )
        ) {
            // Reset to default settings
            this.setState({
                settings: {
                    language: "en",
                    theme: "light",
                    timezone: "UTC+7",
                    notifications: true,
                    autoSave: true,
                    maxFlightTime: 60,
                    maxSpeed: 100,
                    maxAltitude: 400,
                    lowBatteryWarning: 20,
                    mapProvider: "openstreetmap",
                    defaultZoom: 10,
                    showTraffic: false,
                    showWeather: true,
                    dataSharing: false,
                    analyticsTracking: false,
                    crashReporting: true,
                    debugMode: false,
                    logLevel: "info",
                    cacheSize: 500,
                    autoUpdate: true,
                },
            });
        }
    };

    renderGeneralSettings = () => {
        const { settings } = this.state;

        return (
            <div className="settings-section">
                <h3>
                    <FormattedMessage id="settings.general.title" />
                </h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-language"></i>
                        <FormattedMessage id="settings.general.language" />
                    </label>
                    <select
                        value={settings.language}
                        onChange={(e) =>
                            this.handleSettingChange("language", e.target.value)
                        }
                        className="setting-select">
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-palette"></i>
                        <FormattedMessage id="settings.general.theme" />
                        <span className="theme-preview">
                            <i
                                className={themeUtils.getThemeIcon(
                                    settings.theme
                                )}></i>
                        </span>
                    </label>
                    <select
                        value={settings.theme}
                        onChange={(e) =>
                            this.handleSettingChange("theme", e.target.value)
                        }
                        className="setting-select">
                        {themeUtils.getAvailableThemes().map((theme) => (
                            <option key={theme.value} value={theme.value}>
                                {theme.label}
                            </option>
                        ))}
                    </select>
                    <small className="setting-description">
                        <FormattedMessage id="settings.general.theme-description" />
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-clock"></i>
                        <FormattedMessage id="settings.general.timezone" />
                    </label>
                    <select
                        value={settings.timezone}
                        onChange={(e) =>
                            this.handleSettingChange("timezone", e.target.value)
                        }
                        className="setting-select">
                        <option value="UTC+7">UTC+7 (Vietnam)</option>
                        <option value="UTC+0">UTC+0 (GMT)</option>
                        <option value="UTC-5">UTC-5 (EST)</option>
                        <option value="UTC-8">UTC-8 (PST)</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-bell"></i>
                        <FormattedMessage id="settings.general.enable-notifications" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="notifications"
                            checked={settings.notifications}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "notifications",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="notifications"
                            className="toggle-label"></label>
                    </div>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-save"></i>
                        <FormattedMessage id="settings.general.auto-save" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="autoSave"
                            checked={settings.autoSave}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "autoSave",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="autoSave"
                            className="toggle-label"></label>
                    </div>
                </div>
            </div>
        );
    };
    renderPrivacySettings = () => {
        const { settings } = this.state;

        return (
            <div className="settings-section">
                <h3>
                    <FormattedMessage id="settings.privacy.title" />
                </h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-share-alt"></i>
                        <FormattedMessage id="settings.privacy.data-sharing" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="dataSharing"
                            checked={settings.dataSharing}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "dataSharing",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="dataSharing"
                            className="toggle-label"></label>
                    </div>
                    <small className="setting-description">
                        <FormattedMessage id="settings.privacy.data-sharing-description" />
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-chart-line"></i>
                        <FormattedMessage id="settings.privacy.analytics-tracking" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="analyticsTracking"
                            checked={settings.analyticsTracking}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "analyticsTracking",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="analyticsTracking"
                            className="toggle-label"></label>
                    </div>
                    <small className="setting-description">
                        <FormattedMessage id="settings.privacy.analytics-tracking-description" />
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-bug"></i>
                        <FormattedMessage id="settings.privacy.crash-reporting" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="crashReporting"
                            checked={settings.crashReporting}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "crashReporting",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="crashReporting"
                            className="toggle-label"></label>
                    </div>
                    <small className="setting-description">
                        <FormattedMessage id="settings.privacy.crash-reporting-description" />
                    </small>
                </div>
            </div>
        );
    };
    renderAdvancedSettings = () => {
        const { settings } = this.state;

        return (
            <div className="settings-section">
                <h3>
                    <FormattedMessage id="settings.advanced.title" />
                </h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-code"></i>
                        <FormattedMessage id="settings.advanced.debug-mode" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="debugMode"
                            checked={settings.debugMode}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "debugMode",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="debugMode"
                            className="toggle-label"></label>
                    </div>
                    <small className="setting-description">
                        <FormattedMessage id="settings.advanced.debug-mode-description" />
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-list"></i>
                        <FormattedMessage id="settings.advanced.debug-mode-description" />
                    </label>
                    <select
                        value={settings.logLevel}
                        onChange={(e) =>
                            this.handleSettingChange("logLevel", e.target.value)
                        }
                        className="setting-select">
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-hdd"></i>
                        <FormattedMessage id="settings.advanced.cache-size" />
                    </label>
                    <input
                        type="number"
                        value={settings.cacheSize}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "cacheSize",
                                parseInt(e.target.value)
                            )
                        }
                        className="setting-input"
                        min="100"
                        max="2000"
                    />
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-sync-alt"></i>
                        <FormattedMessage id="settings.advanced.auto-update" />
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="autoUpdate"
                            checked={settings.autoUpdate}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "autoUpdate",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="autoUpdate"
                            className="toggle-label"></label>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { activeTab, settings, currentTheme } = this.state;

        return (
            <div className={`settings-container`}>
                <div className="settings-header">
                    <div className="header-content">
                        <h1>
                            <i className="fas fa-cog"></i>
                            <FormattedMessage id="settings.title" />
                        </h1>
                        <p>
                            <FormattedMessage id="settings.text-notice" />
                        </p>
                    </div>
                    <div className="header-actions">
                        {/* Test Theme Button */}

                        <button
                            className="theme-toggle-btn"
                            onClick={() => {
                                const newTheme = themeUtils.toggleTheme();
                                // Apply theme with our method
                                this.applyThemeToDocument(newTheme);

                                this.setState((prevState) => ({
                                    currentTheme: newTheme,
                                    settings: {
                                        ...prevState.settings,
                                        theme: newTheme,
                                    },
                                }));
                            }}
                            title={`Switch to ${
                                settings.theme === "light" ? "dark" : "light"
                            } theme`}>
                            <i
                                className={themeUtils.getThemeIcon(
                                    settings.theme
                                )}></i>
                        </button>
                    </div>
                </div>

                <div className="settings-content">
                    <div className="settings-sidebar">
                        <div className="settings-tabs">
                            <button
                                className={`tab-button ${
                                    activeTab === "general" ? "active" : ""
                                }`}
                                onClick={() => this.handleTabChange("general")}>
                                <i className="fas fa-sliders-h"></i>
                                <FormattedMessage id="settings.general-sidebar" />
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "privacy" ? "active" : ""
                                }`}
                                onClick={() => this.handleTabChange("privacy")}>
                                <i className="fas fa-shield-alt"></i>
                                <FormattedMessage id="settings.privacy-sidebar" />
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "advanced" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.handleTabChange("advanced")
                                }>
                                <i className="fas fa-code"></i>
                                <FormattedMessage id="settings.advanced-sidebar" />
                            </button>
                        </div>
                    </div>

                    <div className="settings-main">
                        {activeTab === "general" &&
                            this.renderGeneralSettings()}
                        {activeTab === "privacy" &&
                            this.renderPrivacySettings()}
                        {activeTab === "advanced" &&
                            this.renderAdvancedSettings()}
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="btn-reset" onClick={this.handleReset}>
                        <i className="fas fa-undo"></i>
                        <FormattedMessage id="settings.reset-to-defaults" />
                    </button>
                    <button className="btn-save" onClick={this.handleSave}>
                        <i className="fas fa-save"></i>
                        <FormattedMessage id="settings.save-changes" />
                    </button>
                </div>
            </div>
        );
    }
}

const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(Settings)
);
