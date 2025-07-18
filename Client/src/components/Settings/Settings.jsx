import React, { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import themeUtils from "../../utils/ThemeUtils";
import "./Settings.css";

class Settings extends Component {
    constructor(props) {
        super(props);
        
        // Load theme from localStorage or default to light
        const savedTheme = themeUtils.getStoredTheme();
        
        this.state = {
            activeTab: "general",
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
        
        // Add theme change listener
        themeUtils.addListener(this.handleThemeChange);
    }

    componentWillUnmount() {
        // Remove theme change listener
        themeUtils.removeListener(this.handleThemeChange);
    }

    handleThemeChange = (theme) => {
        // Update state when theme changes
        this.setState(prevState => ({
            settings: {
                ...prevState.settings,
                theme: theme
            }
        }));
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    handleSettingChange = (key, value) => {
        this.setState((prevState) => ({
            settings: {
                ...prevState.settings,
                [key]: value,
            },
        }));
        
        // Apply theme immediately when theme setting changes
        if (key === 'theme') {
            themeUtils.applyTheme(value);
        }
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
                <h3>General Settings</h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-language"></i>
                        Language
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
                        Theme
                        <span className="theme-preview">
                            <i className={themeUtils.getThemeIcon(settings.theme)}></i>
                        </span>
                    </label>
                    <select
                        value={settings.theme}
                        onChange={(e) =>
                            this.handleSettingChange("theme", e.target.value)
                        }
                        className="setting-select">
                        {themeUtils.getAvailableThemes().map(theme => (
                            <option key={theme.value} value={theme.value}>
                                {theme.label}
                            </option>
                        ))}
                    </select>
                    <small className="setting-description">
                        Choose your preferred theme. Auto will match your system settings.
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-clock"></i>
                        Timezone
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
                        Enable Notifications
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
                        Auto Save
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

    renderUAVSettings = () => {
        const { settings } = this.state;

        return (
            <div className="settings-section">
                <h3>UAV Settings</h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-stopwatch"></i>
                        Max Flight Time (minutes)
                    </label>
                    <input
                        type="number"
                        value={settings.maxFlightTime}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "maxFlightTime",
                                parseInt(e.target.value)
                            )
                        }
                        className="setting-input"
                        min="1"
                        max="120"
                    />
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-tachometer-alt"></i>
                        Max Speed (km/h)
                    </label>
                    <input
                        type="number"
                        value={settings.maxSpeed}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "maxSpeed",
                                parseInt(e.target.value)
                            )
                        }
                        className="setting-input"
                        min="1"
                        max="200"
                    />
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-mountain"></i>
                        Max Altitude (meters)
                    </label>
                    <input
                        type="number"
                        value={settings.maxAltitude}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "maxAltitude",
                                parseInt(e.target.value)
                            )
                        }
                        className="setting-input"
                        min="1"
                        max="500"
                    />
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-battery-quarter"></i>
                        Low Battery Warning (%)
                    </label>
                    <input
                        type="number"
                        value={settings.lowBatteryWarning}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "lowBatteryWarning",
                                parseInt(e.target.value)
                            )
                        }
                        className="setting-input"
                        min="5"
                        max="50"
                    />
                </div>
            </div>
        );
    };

    renderMapSettings = () => {
        const { settings } = this.state;

        return (
            <div className="settings-section">
                <h3>Map Settings</h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-map"></i>
                        Map Provider
                    </label>
                    <select
                        value={settings.mapProvider}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "mapProvider",
                                e.target.value
                            )
                        }
                        className="setting-select">
                        <option value="openstreetmap">OpenStreetMap</option>
                        <option value="google">Google Maps</option>
                        <option value="mapbox">Mapbox</option>
                        <option value="bing">Bing Maps</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-search-plus"></i>
                        Default Zoom Level
                    </label>
                    <input
                        type="range"
                        value={settings.defaultZoom}
                        onChange={(e) =>
                            this.handleSettingChange(
                                "defaultZoom",
                                parseInt(e.target.value)
                            )
                        }
                        className="setting-range"
                        min="1"
                        max="20"
                    />
                    <span className="range-value">{settings.defaultZoom}</span>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-traffic-light"></i>
                        Show Traffic
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="showTraffic"
                            checked={settings.showTraffic}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "showTraffic",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="showTraffic"
                            className="toggle-label"></label>
                    </div>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-cloud-sun"></i>
                        Show Weather
                    </label>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="showWeather"
                            checked={settings.showWeather}
                            onChange={(e) =>
                                this.handleSettingChange(
                                    "showWeather",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="showWeather"
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
                <h3>Privacy & Security</h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-share-alt"></i>
                        Data Sharing
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
                        Share anonymous usage data to help improve the service
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-chart-line"></i>
                        Analytics Tracking
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
                        Enable analytics to help us understand how you use the
                        app
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-bug"></i>
                        Crash Reporting
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
                        Automatically send crash reports to help us fix issues
                    </small>
                </div>
            </div>
        );
    };

    renderAdvancedSettings = () => {
        const { settings } = this.state;

        return (
            <div className="settings-section">
                <h3>Advanced Settings</h3>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-code"></i>
                        Debug Mode
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
                        Enable debug mode for development purposes
                    </small>
                </div>

                <div className="setting-group">
                    <label className="setting-label">
                        <i className="fas fa-list"></i>
                        Log Level
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
                        Cache Size (MB)
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
                        Auto Update
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
        const { activeTab, settings } = this.state;

        return (
            <div className="settings-container">
                <div className="settings-header">
                    <div className="header-content">
                        <h1>
                            <i className="fas fa-cog"></i>
                            Settings
                        </h1>
                        <p>Customize your UAV management experience</p>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="theme-toggle-btn"
                            onClick={() => {
                                const newTheme = themeUtils.toggleTheme();
                                this.setState(prevState => ({
                                    settings: {
                                        ...prevState.settings,
                                        theme: newTheme
                                    }
                                }));
                            }}
                            title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`}
                        >
                            <i className={themeUtils.getThemeIcon(settings.theme)}></i>
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
                                General
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "uav" ? "active" : ""
                                }`}
                                onClick={() => this.handleTabChange("uav")}>
                                <i className="fas fa-drone"></i>
                                UAV
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "map" ? "active" : ""
                                }`}
                                onClick={() => this.handleTabChange("map")}>
                                <i className="fas fa-map"></i>
                                Map
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "privacy" ? "active" : ""
                                }`}
                                onClick={() => this.handleTabChange("privacy")}>
                                <i className="fas fa-shield-alt"></i>
                                Privacy
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "advanced" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.handleTabChange("advanced")
                                }>
                                <i className="fas fa-code"></i>
                                Advanced
                            </button>
                        </div>
                    </div>

                    <div className="settings-main">
                        {activeTab === "general" &&
                            this.renderGeneralSettings()}
                        {activeTab === "uav" && this.renderUAVSettings()}
                        {activeTab === "map" && this.renderMapSettings()}
                        {activeTab === "privacy" &&
                            this.renderPrivacySettings()}
                        {activeTab === "advanced" &&
                            this.renderAdvancedSettings()}
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="btn-reset" onClick={this.handleReset}>
                        <i className="fas fa-undo"></i>
                        Reset to Default
                    </button>
                    <button className="btn-save" onClick={this.handleSave}>
                        <i className="fas fa-save"></i>
                        Save Settings
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
