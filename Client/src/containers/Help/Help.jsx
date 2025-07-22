import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import "./Help.css";

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSection: "getting-started",
            searchTerm: "",
            expandedFAQ: null,
        };
    }

    handleSectionClick = (section) => {
        this.setState({ activeSection: section });
    };

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    toggleFAQ = (index) => {
        this.setState({
            expandedFAQ: this.state.expandedFAQ === index ? null : index,
        });
    };

    render() {
        const { activeSection, searchTerm, expandedFAQ } = this.state;

        const faqData = [
            {
                questionKey: "help.faq-items.q1",
                answerKey: "help.faq-items.a1",
            },
            {
                questionKey: "help.faq-items.q2",
                answerKey: "help.faq-items.a2",
            },
            {
                questionKey: "help.faq-items.q3",
                answerKey: "help.faq-items.a3",
            },
            {
                questionKey: "help.faq-items.q4",
                answerKey: "help.faq-items.a4",
            },
            {
                questionKey: "help.faq-items.q5",
                answerKey: "help.faq-items.a5",
            },
        ];

        // For search functionality, use intl to get translated messages
        const { intl } = this.props;
        const filteredFAQ = faqData.filter((item) => {
            if (searchTerm === "") return true;

            const question = intl.formatMessage({ id: item.questionKey });
            const answer = intl.formatMessage({ id: item.answerKey });

            return (
                question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                answer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        return (
            <div className="help-container">
                <div className="help-header">
                    <div className="help-title">
                        <h1>
                            <i className="fas fa-question-circle"></i>
                            <FormattedMessage id="help.title" />
                        </h1>
                        <p>
                            <FormattedMessage id="help.subtitle" />
                        </p>
                    </div>

                    <div className="help-search">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder={this.props.intl.formatMessage({
                                    id: "help.search-placeholder",
                                })}
                                value={searchTerm}
                                onChange={this.handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="help-content">
                    <div className="help-sidebar">
                        <div className="help-nav">
                            <div className="nav-title">
                                <FormattedMessage id="help.quick-navigation" />
                            </div>
                            <div
                                className={`nav-item ${
                                    activeSection === "getting-started"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.handleSectionClick("getting-started")
                                }>
                                <i className="fas fa-play-circle"></i>
                                <FormattedMessage id="help.getting-started" />
                            </div>
                            <div
                                className={`nav-item ${
                                    activeSection === "user-guide"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.handleSectionClick("user-guide")
                                }>
                                <i className="fas fa-book"></i>
                                <FormattedMessage id="help.user-guide" />
                            </div>
                            <div
                                className={`nav-item ${
                                    activeSection === "faq" ? "active" : ""
                                }`}
                                onClick={() => this.handleSectionClick("faq")}>
                                <i className="fas fa-question"></i>
                                <FormattedMessage id="help.faq" />
                            </div>
                            <div
                                className={`nav-item ${
                                    activeSection === "contact" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.handleSectionClick("contact")
                                }>
                                <i className="fas fa-envelope"></i>
                                <FormattedMessage id="help.contact-support" />
                            </div>
                        </div>

                        <div className="quick-links">
                            <div className="quick-links-title">
                                <FormattedMessage id="help.quick-links" />
                            </div>
                            <a href="/registration" className="quick-link">
                                <i className="fas fa-plus"></i>
                                <FormattedMessage id="help.register-uav" />
                            </a>
                            <a href="/live-tracking" className="quick-link">
                                <i className="fas fa-map-marker-alt"></i>
                                <FormattedMessage id="help.live-tracking" />
                            </a>
                            <a href="/dashboard" className="quick-link">
                                <i className="fas fa-tachometer-alt"></i>
                                <FormattedMessage id="help.dashboard" />
                            </a>
                        </div>
                    </div>

                    <div className="help-main">
                        {activeSection === "getting-started" && (
                            <div className="help-section">
                                <h2>
                                    <FormattedMessage id="help.getting-started" />
                                </h2>
                                <div className="steps-container">
                                    <div className="step-card">
                                        <div className="step-number">1</div>
                                        <div className="step-content">
                                            <h3>
                                                <FormattedMessage id="help.steps.step1.title" />
                                            </h3>
                                            <p>
                                                <FormattedMessage id="help.steps.step1.description" />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="step-card">
                                        <div className="step-number">2</div>
                                        <div className="step-content">
                                            <h3>
                                                <FormattedMessage id="help.steps.step2.title" />
                                            </h3>
                                            <p>
                                                <FormattedMessage id="help.steps.step2.description" />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="step-card">
                                        <div className="step-number">3</div>
                                        <div className="step-content">
                                            <h3>
                                                <FormattedMessage id="help.steps.step3.title" />
                                            </h3>
                                            <p>
                                                <FormattedMessage id="help.steps.step3.description" />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="step-card">
                                        <div className="step-number">4</div>
                                        <div className="step-content">
                                            <h3>
                                                <FormattedMessage id="help.steps.step4.title" />
                                            </h3>
                                            <p>
                                                <FormattedMessage id="help.steps.step4.description" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === "user-guide" && (
                            <div className="help-section">
                                <h2>
                                    <FormattedMessage id="help.user-guide" />
                                </h2>
                                <div className="guide-categories">
                                    <div className="guide-category">
                                        <div className="category-header">
                                            <i className="fas fa-drone"></i>
                                            <h3>
                                                <FormattedMessage id="help.guide.uav-management.title" />
                                            </h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <FormattedMessage id="help.guide.uav-management.item1" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.uav-management.item2" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.uav-management.item3" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.uav-management.item4" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="guide-category">
                                        <div className="category-header">
                                            <i className="fas fa-route"></i>
                                            <h3>
                                                <FormattedMessage id="help.guide.flight-planning.title" />
                                            </h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <FormattedMessage id="help.guide.flight-planning.item1" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.flight-planning.item2" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.flight-planning.item3" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.flight-planning.item4" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="guide-category">
                                        <div className="category-header">
                                            <i className="fas fa-chart-line"></i>
                                            <h3>
                                                <FormattedMessage id="help.guide.monitoring.title" />
                                            </h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <FormattedMessage id="help.guide.monitoring.item1" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.monitoring.item2" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.monitoring.item3" />
                                            </li>
                                            <li>
                                                <FormattedMessage id="help.guide.monitoring.item4" />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === "faq" && (
                            <div className="help-section">
                                <h2>
                                    <FormattedMessage id="help.faq" />
                                </h2>
                                <div className="faq-container">
                                    {filteredFAQ.map((item, index) => (
                                        <div key={index} className="faq-item">
                                            <div
                                                className="faq-question"
                                                onClick={() =>
                                                    this.toggleFAQ(index)
                                                }>
                                                <span>
                                                    <FormattedMessage
                                                        id={item.questionKey}
                                                    />
                                                </span>
                                                <i
                                                    className={`fas fa-chevron-${
                                                        expandedFAQ === index
                                                            ? "up"
                                                            : "down"
                                                    }`}></i>
                                            </div>
                                            {expandedFAQ === index && (
                                                <div className="faq-answer">
                                                    <p>
                                                        <FormattedMessage
                                                            id={item.answerKey}
                                                        />
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === "contact" && (
                            <div className="help-section">
                                <h2>
                                    <FormattedMessage id="help.contact-support" />
                                </h2>
                                <div className="contact-options">
                                    <div className="contact-card">
                                        <div className="contact-icon">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <h3>
                                            <FormattedMessage id="help.contact.email-support" />
                                        </h3>
                                        <p>
                                            <FormattedMessage id="help.contact.email-description" />
                                        </p>
                                        <a
                                            href="mailto:support@uavregistry.com"
                                            className="contact-btn">
                                            <FormattedMessage id="help.contact.send-email" />
                                        </a>
                                    </div>
                                    <div className="contact-card">
                                        <div className="contact-icon">
                                            <i className="fas fa-phone"></i>
                                        </div>
                                        <h3>
                                            <FormattedMessage id="help.contact.phone-support" />
                                        </h3>
                                        <p>
                                            <FormattedMessage id="help.contact.phone-description" />
                                        </p>
                                        <a
                                            href="tel:+1234567890"
                                            className="contact-btn">
                                            <FormattedMessage id="help.contact.call-now" />
                                        </a>
                                    </div>
                                    <div className="contact-card">
                                        <div className="contact-icon">
                                            <i className="fas fa-comments"></i>
                                        </div>
                                        <h3>
                                            <FormattedMessage id="help.contact.live-chat" />
                                        </h3>
                                        <p>
                                            <FormattedMessage id="help.contact.chat-description" />
                                        </p>
                                        <button className="contact-btn">
                                            <FormattedMessage id="help.contact.start-chat" />
                                        </button>
                                    </div>
                                </div>

                                <div className="support-hours">
                                    <h3>
                                        <FormattedMessage id="help.contact.support-hours" />
                                    </h3>
                                    <div className="hours-grid">
                                        <div className="hours-item">
                                            <span className="day">
                                                <FormattedMessage id="help.contact.monday-friday" />
                                            </span>
                                            <span className="time">
                                                9:00 AM - 6:00 PM
                                            </span>
                                        </div>
                                        <div className="hours-item">
                                            <span className="day">
                                                <FormattedMessage id="help.contact.saturday" />
                                            </span>
                                            <span className="time">
                                                10:00 AM - 4:00 PM
                                            </span>
                                        </div>
                                        <div className="hours-item">
                                            <span className="day">
                                                <FormattedMessage id="help.contact.sunday" />
                                            </span>
                                            <span className="time">
                                                <FormattedMessage id="help.contact.closed" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(Help);
