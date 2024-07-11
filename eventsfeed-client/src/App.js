import React, { Component } from "react";
import { sendNotification } from "./ApiUtil.js";
import "antd/dist/reset.css";
import "./App.css";
import { UserOutlined, HomeOutlined, MessageOutlined, BellOutlined } from '@ant-design/icons';
import {
  Popover,
  Badge,
  List,
  notification,
  Typography,
  Input,
  Button,
} from "antd";

const { Title } = Typography;

class App extends Component {
  state = {
    newNotifications: [],
    notifications: [],
    loggedInUser: null,
    username: "",
    to: "",
    message: "",
  };

  componentDidMount() { }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.loggedInUser !== "" &&
      prevState.loggedInUser !== this.state.loggedInUser
    ) {
      this.initListener();
    }
  }

  initListener = () => {
    const eventSource = new EventSource("http://localhost:8080/subscription");

    eventSource.onopen = (e) => console.log("EventSource Open");

    eventSource.onerror = (e) => {
      if (e.readyState === EventSource.CLOSED) {
        console.log("EventSource close");
      } else {
        console.log(e);
      }
      this.initListener();
    };

    eventSource.addEventListener(
      this.state.loggedInUser,
      this.handleServerEvent,
      false
    );
  };

  handleServerEvent = (e) => {
    const json = JSON.parse(e.data);
    let newNotifications = this.state.newNotifications;
    newNotifications.unshift({
      from: json.from,
      message: json.message,
      isRead: false,
    });

    this.setState({ newNotifications: newNotifications });

    notification.config({
      placement: "bottomLeft",
    });

    notification.open({
      message: (
        <div>
          <b>{json.from}</b> {json.message}
        </div>
      ),
    });
  };

  handleSendNotification = () => {
    const notificationRequest = {
      from: this.state.loggedInUser,
      message: this.state.message,
    };
    sendNotification(this.state.to, notificationRequest);
    this.setState({ to: '', message: '' });
  };

  handleOnClick = () => {
    let notifications = this.state.notifications;
    notifications = this.state.newNotifications.concat(notifications);
    console.log(notifications);
    this.setState({ newNotifications: [], notifications: notifications });
  };

  handleItemClick = (notification) => {
    const notifications = this.state.notifications.map((item) => {
      if (item === notification) item.isRead = true;
      return item;
    });

    this.setState({ notifications });
  };

  render() {
    let iconClass = "icon-dimmed";

    if (this.state.newNotifications.length > 0) {
      iconClass = "icon-active";
    }

    const text = (
      <span>
        <b>Notifications</b>
      </span>
    );
    const content = (
      <div>
        <List
          dataSource={this.state.notifications}
          renderItem={(notification) => (
            <List.Item
              className={notification.isRead ? "item-read" : "item-not-read"}
              onClick={() => this.handleItemClick(notification)}
            >
              <span style={{ padding: "2px 20px" }}>
                <b>{notification.from}</b> {notification.message}
              </span>
            </List.Item>
          )}
        />
      </div>
    );

    return (
      <div className="App">
        {!this.state.loggedInUser && (
          <div
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              margin: 20,
              width: 300,
              height: 90,
              border: "1px solid #fafafa",
              borderRadius: 5,
              boxShadow:
                "0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.19)",
              backgroundColor: "white",
              paddingTop: 5,
            }}
          >
            <Title level={4}>Login with</Title>
            <Input
              size="default"
              style={{ width: 150 }}
              placeholder="Username"
              prefix={<UserOutlined />}
              value={this.state.username}
              onChange={(event) =>
                this.setState({ username: event.target.value })
              }
              id="usernameInput"
            />
            <Button
              onClick={() => {
                if (this.state.username !== "")
                  this.setState({ loggedInUser: this.state.username });
              }}
              type="primary"
              style={{ marginLeft: 10 }}
            >
              Login
            </Button>
          </div>
        )}
        {this.state.loggedInUser && (
          <div>
            <div className="menuBar">
              <div className="logo">
                <img src="/boyIcon.png" alt="PNIMAC News Feed Demo" className="circle-image" />
                <a href="#">Welcome {this.state.loggedInUser}</a>
              </div>
              <div className="menuCon">
                <div className="rightMenu">
                  <a href="#">
                    <HomeOutlined className="icon-dimmed" />
                  </a>
                  <a href="#">
                    <MessageOutlined className="icon-dimmed" />
                  </a>
                  <a href="#" onClick={this.handleOnClick}>
                    <Popover
                      placement="topLeft"
                      title={text}
                      content={content}
                      trigger="click"
                    >
                      <Badge
                        offset={[-2, 10]}
                        count={this.state.newNotifications.length}
                      >
                        <BellOutlined className={iconClass} />
                      </Badge>
                    </Popover>
                  </a>
                </div>
              </div>
            </div>

            {/* send notification form */}
            <div
              style={{
                margin: 20,
                width: 300,
                height: 180,
                border: "1px solid #fafafa",
                borderRadius: 5,
                boxShadow:
                  "0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.19)",
                backgroundColor: "white",
                padding: 10,
              }}
            >
              <Title level={4}>Send notification</Title>
              <Input
                size="default"
                style={{ marginBottom: 10 }}
                addonBefore="To"
                value={this.state.to}
                onChange={(event) => this.setState({ to: event.target.value })}
                id="toInput"
              />
              <Input
                size="default"
                style={{ marginBottom: 10 }}
                addonBefore="Message"
                value={this.state.message}
                onChange={(event) =>
                  this.setState({ message: event.target.value })
                }
                id="messageInput"
              />
              <br />
              <Button onClick={this.handleSendNotification} type="primary">
                Send
              </Button>
            </div>
            {/* end of send notification form */}
          </div>
        )}
      </div>
    );
  }
}

export default App;
