import React, { Component } from "react";
import classnames from "classnames";

class SMSForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        to: "",
        body: ""
      },
      submitting: false,
      error: false,
      fadeUp: false
    };
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    document.title = "iOS Messenger";
  }

  onHandleChange(event) {
    const name = event.target.getAttribute("name");
    if (name === "to") {
      console.log(
        event.target.value
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
          .substring(0, 12)
      );
      this.setState({
        message: {
          ...this.state.message,
          [name]: event.target.value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
            .substring(0, 12)
        },
        fadeUp: false
      });
    } else {
      this.setState({
        message: { ...this.state.message, [name]: event.target.value },
        fadeUp: false
      });
    }
  }

  onSubmit(event) {
    console.log(this.state.message.to);
    event.preventDefault();
    this.setState({ submitting: true, fadeUp: true });
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: this.state.message.to.replace(/-/g, ""),
        body: this.state.message.body
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({
            error: false,
            submitting: false,
            message: {
              to: "",
              body: ""
            }
          });
        } else {
          this.setState({
            error: true,
            submitting: false
          });
          console.log(data);
        }
      });
  }

  render() {
    return (
      <div className="display-wrapper">
        <form
          onSubmit={this.onSubmit}
          className={this.state.error ? "error sms-form" : "sms-form"}
        >
          <div>
            <div className="input-to">
              <input
                type="tel"
                name="to"
                id="to"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-456-7890"
                value={this.state.message.to}
                onChange={this.onHandleChange}
                required
              />
            </div>
          </div>
          <div className="input-body">
            <input
              name="body"
              id="body"
              value={this.state.message.body}
              onChange={this.onHandleChange}
              required
            />
            <button type="submit" disabled={this.state.submitting}>
              <img
                src="https://cdn.glitch.com/41f5251e-3644-46a2-9d39-ba6a73092b71%2Fup-arrow.png?v=1599801634073"
                alt="send"
              />
            </button>
          </div>
        </form>
        <div
          className={classnames(
            "chat-bubble",
            this.state.message.body === "" ? "hide" : "",
            this.state.fadeUp ? "fadeOutUp" : ""
          )}
        >
          {this.state.message.body}
        </div>
      </div>
    );
  }
}

export default SMSForm;
