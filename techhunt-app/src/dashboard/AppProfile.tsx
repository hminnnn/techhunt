import classNames from "classnames";
import React from "react";
interface AppProps {}
interface AppState {
  expanded: boolean;
}

export class AppProfile extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({ expanded: !this.state.expanded });
    event.preventDefault();
  }

  render() {
    return (
      <div className="layout-profile">
        <div>
          <img src="../public/profile.png" alt="" />
        </div>
        <button className="p-link layout-profile-link" onClick={this.onClick}>
          <span className="username">Hui Min</span>
        
        </button>
        <ul
          className={classNames({
            "layout-profile-expanded": this.state.expanded,
          })}
        >
          <li>
            <button className="p-link">
              <i className="pi pi-fw pi-user" />
              <span>Account</span>
            </button>
          </li>
          <li>
            <button className="p-link">
              <i className="pi pi-fw pi-inbox" />
              <span>Notifications</span>
              <span className="menuitem-badge">2</span>
            </button>
          </li>
          <li>
            <button className="p-link">
              <i className="pi pi-fw pi-power-off" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
