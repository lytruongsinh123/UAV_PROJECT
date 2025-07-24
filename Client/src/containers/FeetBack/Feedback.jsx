import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { sendEmail } from "../../service/emailService";
import themeUtils from "../../utils/ThemeUtils";
import "./Feedback.css";

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackData: {
                name: "",
                email: "",
                category: "general",
                rating: 5,
                subject: "",
                message: "",
            },
            isSubmitting: false,
            submitStatus: null, // 'success', 'error', null
            errors: {},
            currentTheme: props.currentTheme || themeUtils.getCurrentTheme(),
        };
    }

    componentDidMount() {
        // Initialize theme detection
        themeUtils.init();

        // Add theme change listener
        this.handleThemeChange = () => {
            const newTheme = themeUtils.getCurrentTheme();
            if (newTheme !== this.state.currentTheme) {
                this.setState({ currentTheme: newTheme });
            }
        };

        // Listen for theme changes via themeUtils
        themeUtils.addListener(this.handleThemeChange);

        // Also listen for manual class changes on document
        this.observer = new MutationObserver(() => {
            this.handleThemeChange();
        });

        this.observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        });
    }

    componentDidUpdate(prevProps) {
        // Cập nhật theme khi props từ Redux thay đổi
        if (prevProps.currentTheme !== this.props.currentTheme) {
            this.setState({ currentTheme: this.props.currentTheme });
        }

        // Cập nhật user info khi user login/logout
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                feedbackData: {
                    ...this.state.feedbackData,
                    name: this.props.userInfo?.firstName || "",
                    email: this.props.userInfo?.email || "",
                },
            });
        }
    }

    componentWillUnmount() {
        // Remove theme listener
        if (themeUtils.removeListener) {
            themeUtils.removeListener(this.handleThemeChange);
        }

        // Disconnect mutation observer
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    handleInputChange = (field, value) => {
        this.setState({
            feedbackData: {
                ...this.state.feedbackData,
                [field]: value,
            },
            errors: {
                ...this.state.errors,
                [field]: "",
            },
        });
    };

    validateForm = () => {
        const { feedbackData } = this.state;
        const { intl } = this.props;
        const errors = {};

        // Validate required fields
        if (!feedbackData.name.trim()) {
            errors.name = intl.formatMessage({
                id: "feedback.validation.name-required",
            });
        }

        if (!feedbackData.email.trim()) {
            errors.email = intl.formatMessage({
                id: "feedback.validation.email-required",
            });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackData.email)) {
            errors.email = intl.formatMessage({
                id: "feedback.validation.email-invalid",
            });
        }

        if (!feedbackData.subject.trim()) {
            errors.subject = intl.formatMessage({
                id: "feedback.validation.subject-required",
            });
        }

        if (!feedbackData.message.trim()) {
            errors.message = intl.formatMessage({
                id: "feedback.validation.message-required",
            });
        } else if (feedbackData.message.trim().length < 10) {
            errors.message = intl.formatMessage({
                id: "feedback.validation.message-too-short",
            });
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setState({ isSubmitting: true, submitStatus: null });
        try {
            const response = await sendEmail({
                name: this.state.feedbackData.name,
                email: this.state.feedbackData.email,
                category: this.state.feedbackData.category,
                subject: this.state.feedbackData.subject,
                message: this.state.feedbackData.message,
                language: this.props.language,
            });
            if (response.errCode === 0) {
                this.setState({
                    submitStatus: "success",
                    feedbackData: {
                        name: "",
                        email: "",
                        category: "general",
                        rating: 5,
                        subject: "",
                        message: "",
                    },
                });
            } else {
                this.setState({ submitStatus: "error" });
            }
        } catch (error) {
            console.error("Error sending feedback:", error);
            this.setState({ submitStatus: "error" });
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    handleRatingClick = (rating) => {
        this.handleInputChange("rating", rating);
    };
    render() {
        const {
            feedbackData,
            isSubmitting,
            submitStatus,
            errors,
            currentTheme,
        } = this.state;
        const { intl } = this.props;

        return (
            <div
                className={`feedback-container ${currentTheme}`}
                data-theme={currentTheme}>
                {/* Testing theme detection */}

                <div className="feedback-header">
                    <div className="feedback-title">
                        <h1>
                            <i className="fas fa-comment-alt"></i>
                            <FormattedMessage id="feedback.title" />
                        </h1>
                        <p>
                            <FormattedMessage id="feedback.subtitle" />
                        </p>
                    </div>
                    <div className="feedback-stats">
                        <div className="stat-item">
                            <div className="feedback-stat-number">4.8</div>
                            <div className="stat-label">
                                <FormattedMessage id="feedback.average-rating" />
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="feedback-stat-number">1,247</div>
                            <div className="stat-label">
                                <FormattedMessage id="feedback.total-feedback" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="feedback-content">
                    <div className="feedback-form-container">
                        {submitStatus === "success" && (
                            <div className="success-message">
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h3>
                                        <FormattedMessage id="feedback.success.title" />
                                    </h3>
                                    <p>
                                        <FormattedMessage id="feedback.success.message" />
                                    </p>
                                </div>
                            </div>
                        )}

                        {submitStatus === "error" && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                <div>
                                    <h3>
                                        <FormattedMessage id="feedback.error.title" />
                                    </h3>
                                    <p>
                                        <FormattedMessage id="feedback.error.message" />
                                    </p>
                                </div>
                            </div>
                        )}

                        <form
                            onSubmit={this.handleSubmit}
                            className="feedback-form">
                            <div className="form-section">
                                <h3>
                                    <FormattedMessage id="feedback.personal-info" />
                                </h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <FormattedMessage id="feedback.name" />{" "}
                                            *
                                        </label>
                                        <input
                                            type="text"
                                            value={feedbackData.name}
                                            onChange={(e) =>
                                                this.handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "feedback.name-placeholder",
                                            })}
                                            className={
                                                errors.name ? "error" : ""
                                            }
                                        />
                                        {errors.name && (
                                            <span className="error-text">
                                                {errors.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <FormattedMessage id="feedback.email" />{" "}
                                            *
                                        </label>
                                        <input
                                            type="email"
                                            value={feedbackData.email}
                                            onChange={(e) =>
                                                this.handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "feedback.email-placeholder",
                                            })}
                                            className={
                                                errors.email ? "error" : ""
                                            }
                                        />
                                        {errors.email && (
                                            <span className="error-text">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>
                                    <FormattedMessage id="feedback.feedback-details" />
                                </h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <FormattedMessage id="feedback.category-label" />
                                        </label>
                                        <select
                                            value={feedbackData.category}
                                            onChange={(e) =>
                                                this.handleInputChange(
                                                    "category",
                                                    e.target.value
                                                )
                                            }>
                                            <option value="general">
                                                {intl.formatMessage({
                                                    id: "feedback.category.general",
                                                })}
                                            </option>
                                            <option value="bug-report">
                                                {intl.formatMessage({
                                                    id: "feedback.category.bug-report",
                                                })}
                                            </option>
                                            <option value="feature-request">
                                                {intl.formatMessage({
                                                    id: "feedback.category.feature-request",
                                                })}
                                            </option>
                                            <option value="ui-ux">
                                                {intl.formatMessage({
                                                    id: "feedback.category.ui-ux",
                                                })}
                                            </option>
                                            <option value="performance">
                                                {intl.formatMessage({
                                                    id: "feedback.category.performance",
                                                })}
                                            </option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <FormattedMessage id="feedback.rating" />
                                        </label>
                                        <div className="rating-container">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star ${
                                                        feedbackData.rating >=
                                                        star
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        this.handleRatingClick(
                                                            star
                                                        )
                                                    }>
                                                    <i className="fas fa-star"></i>
                                                </button>
                                            ))}
                                            <span className="rating-text">
                                                ({feedbackData.rating}/5)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="feedback.subject" />{" "}
                                        *
                                    </label>
                                    <input
                                        type="text"
                                        value={feedbackData.subject}
                                        onChange={(e) =>
                                            this.handleInputChange(
                                                "subject",
                                                e.target.value
                                            )
                                        }
                                        placeholder={intl.formatMessage({
                                            id: "feedback.subject-placeholder",
                                        })}
                                        className={
                                            errors.subject ? "error" : ""
                                        }
                                    />
                                    {errors.subject && (
                                        <span className="error-text">
                                            {errors.subject}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="feedback.message" />{" "}
                                        *
                                    </label>
                                    <textarea
                                        value={feedbackData.message}
                                        onChange={(e) =>
                                            this.handleInputChange(
                                                "message",
                                                e.target.value
                                            )
                                        }
                                        placeholder={intl.formatMessage({
                                            id: "feedback.message-placeholder",
                                        })}
                                        rows="6"
                                        className={
                                            errors.message ? "error" : ""
                                        }
                                    />
                                    {errors.message && (
                                        <span className="error-text">
                                            {errors.message}
                                        </span>
                                    )}
                                    <div className="character-count">
                                        {feedbackData.message.length}/1000
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            <FormattedMessage id="feedback.submitting" />
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            <FormattedMessage id="feedback.submit" />
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        this.setState({
                                            feedbackData: {
                                                name: "",
                                                email: "",
                                                category: "general",
                                                rating: 5,
                                                subject: "",
                                                message: "",
                                            },
                                            errors: {},
                                        })
                                    }>
                                    <FormattedMessage id="feedback.reset" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="feedback-sidebar">
                        <div className="feedback-tips">
                            <h3>
                                <i className="fas fa-lightbulb"></i>
                                <FormattedMessage id="feedback.tips.title" />
                            </h3>
                            <ul>
                                <li>
                                    <FormattedMessage id="feedback.tips.tip1" />
                                </li>
                                <li>
                                    <FormattedMessage id="feedback.tips.tip2" />
                                </li>
                                <li>
                                    <FormattedMessage id="feedback.tips.tip3" />
                                </li>
                                <li>
                                    <FormattedMessage id="feedback.tips.tip4" />
                                </li>
                            </ul>
                        </div>

                        <div className="contact-info">
                            <h3>
                                <i className="fas fa-envelope"></i>
                                <FormattedMessage id="feedback.alternative-contact" />
                            </h3>
                            <p>
                                <FormattedMessage id="feedback.alternative-description" />
                            </p>
                            <div className="contact-methods">
                                <a
                                    href="mailto:support@uavregistry.com"
                                    className="contact-method">
                                    <i className="fas fa-envelope"></i>
                                    diepduong607@gmail.com
                                </a>
                                <a
                                    href="tel:+1234567890"
                                    className="contact-method">
                                    <i className="fas fa-phone"></i>
                                    +84 396 928 765
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Map state từ Redux store vào props
const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

// Map dispatch actions vào props
const mapDispatchToProps = (dispatch) => {
    return {
        
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(Feedback));
