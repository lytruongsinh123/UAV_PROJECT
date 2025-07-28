import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import "./Homeuav.css"; // Import file CSS

class Homeuav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  componentDidUpdate = async (prevProps, prevState, snapshot) => {};

  handleExploreClick = () => {
    // Nếu bạn muốn điều hướng đến một trang khác, thêm navigate ở đây
    this.props.navigate("/dashboard"); // Hoặc "/login", tùy bạn
  };

  render() {
    return (
      <div className="homeuav">
        <div className="homeuav-content">
          <h1 className="homeuav-title">Sky Registry</h1>
          <h2 className="homeuav-subtitle">
            Nền tảng quản lý UAV hiện đại, hiệu quả và linh hoạt
          </h2>
          <p className="homeuav-description">
            Mục tiêu của hệ thống là xây dựng một nền tảng phần mềm dựa trên web nhằm quản lý,
            theo dõi và kiểm soát thiết bị bay vận tải không người lái (UAV) một cách hiệu quả,
            an toàn và linh hoạt.
          </p>
          <p className="homeuav-tagline">Điều phối tối ưu – An toàn tối đa!</p>
          <button className="homeuav-btn" onClick={this.handleExploreClick}>
            Khám phá hệ thống
          </button>
        </div>
      </div>
    );
  }
}

// HOC để inject navigate cho class component
const withNavigate = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withNavigate(connect(mapStateToProps, mapDispatchToProps)(Homeuav));





