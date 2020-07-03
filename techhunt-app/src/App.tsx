import "@fortawesome/fontawesome-free/js/all";
import classNames from "classnames";
// import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import * as React from "react";
import { Route } from "react-router-dom";
import { AppMenu } from "./AppMenu";
// import "./App.css";
// import "./App.scss";
// import { AppMenu } from "./AppMenu";
import { AppProfile } from "./AppProfile";
import { AppTopbar } from "./AppTopBar";
import { Dashboard } from "./employee/EmployeeDashboard";
import "./layout/layout.scss";
import * as labels from "../src/resources/labels.json";


interface AppProps {}

interface AppState {
  layoutMode: string;
  layoutColorMode: string;
  staticMenuInactive: boolean;
  overlayMenuActive: boolean;
  mobileMenuActive: boolean;
}

class App extends React.Component<AppProps, AppState> {
  menuClick: any;
  menu: any;
  sidebar: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
  }

  onWrapperClick() {
    // if (!this.menuClick) {
    //   this.setState({
    //     overlayMenuActive: false,
    //     mobileMenuActive: false,
    //   });
    // }
    // this.menuClick = false;
  }

  onToggleMenu(event: React.MouseEvent<HTMLInputElement>) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.state.layoutMode === "overlay") {
        this.setState({
          overlayMenuActive: !this.state.overlayMenuActive,
        });
      } else if (this.state.layoutMode === "static") {
        this.setState({
          staticMenuInactive: !this.state.staticMenuInactive,
        });
      }
    } else {
      const mobileMenuActive = this.state.mobileMenuActive;
      this.setState({
        mobileMenuActive: !mobileMenuActive,
      });
    }

    event.preventDefault();
  }

  onSidebarClick() {
    this.menuClick = true;
  }

  onMenuItemClick(event: { item: any }) {
    if (!event.item.items) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false,
      });
    }
  }

  createMenu() {
    this.menu = [
      {
        label: labels.menu.dashboard,
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location.replace("/");
        }
      }
    ];
  }

  addClass(element: any, className: string) {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  }

  removeClass(element: any, className: string) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  componentDidUpdate() {
    if (this.state.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  }

  render() {
    // const logo =
    //   this.state.layoutColorMode === "dark"
    //     ? "assets/layout/images/logo-white.svg"
    //     : "assets/layout/images/logo.svg";

    const wrapperClass = classNames("layout-wrapper", {
      "layout-overlay": this.state.layoutMode === "overlay",
      "layout-static": this.state.layoutMode === "static",
      "layout-static-sidebar-inactive":
        this.state.staticMenuInactive && this.state.layoutMode === "static",
      "layout-overlay-sidebar-active":
        this.state.overlayMenuActive && this.state.layoutMode === "overlay",
      "layout-mobile-sidebar-active": this.state.mobileMenuActive,
    });

    const sidebarClassName = classNames("layout-sidebar", {
      "layout-sidebar-dark": this.state.layoutColorMode === "dark",
      "layout-sidebar-light": this.state.layoutColorMode === "light",
    });

    return (
      <div className={wrapperClass} onClick={this.onWrapperClick}>
        <AppTopbar onToggleMenu={this.onToggleMenu} />

        <div
          ref={(el) => (this.sidebar = el)}
          className={sidebarClassName}
          onClick={this.onSidebarClick}
        >
          <div className="layout-logo">
            {/* <img alt="Logo" src={logo} /> */}
          </div>
          <AppProfile />
          <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
        </div>

        <div className="layout-main">
          <Route path="/" exact component={Dashboard} />
        </div>

        <div className="layout-mask"></div>
      </div>
    );
  }
}

export default App;
