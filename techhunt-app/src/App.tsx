import "@fortawesome/fontawesome-free/js/all";
import classNames from "classnames";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Route } from "react-router-dom";
import { GrowlProvider } from "./common/Growl";
import { AppMenu } from "./dashboard/AppMenu";
import { AppProfile } from "./dashboard/AppProfile";
import { AppTopbar } from "./dashboard/AppTopBar";
import { Dashboard } from "./employee/EmployeeDashboard";
import { i18n_detectLang } from "./i18n";
import "./layout/layout.scss";

interface AppState {
  layoutMode: string;
  layoutColorMode: string;
  staticMenuInactive: boolean;
  overlayMenuActive: boolean;
  mobileMenuActive: boolean;
  growlMsg: string;
  growlType: string;
}

class App extends React.Component<WithTranslation, AppState> {
  menuClick: any;
  menu: any;
  sidebar: any;

  constructor(props: WithTranslation) {
    super(props);
    this.state = {
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      growlMsg: "",
      growlType: "",
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.clearGrowl = this.clearGrowl.bind(this);
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
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location.replace("/");
        },
      },
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
        new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
        " "
      );
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  componentDidUpdate() {
    if (this.state.mobileMenuActive) this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  }

  componentDidMount() {
    const userLang = navigator.language;
    if (!i18n_detectLang()) {
      this.setState({ growlMsg: "Sorry your language " + userLang + " is not supported :(", growlType: "error" });
    }
  }

  clearGrowl() {
    this.setState({ growlMsg: "", growlType: "" });
  }

  render() {
    const wrapperClass = classNames("layout-wrapper", {
      "layout-overlay": this.state.layoutMode === "overlay",
      "layout-static": this.state.layoutMode === "static",
      "layout-static-sidebar-inactive": this.state.staticMenuInactive && this.state.layoutMode === "static",
      "layout-overlay-sidebar-active": this.state.overlayMenuActive && this.state.layoutMode === "overlay",
      "layout-mobile-sidebar-active": this.state.mobileMenuActive,
    });

    const sidebarClassName = classNames("layout-sidebar", {
      "layout-sidebar-dark": this.state.layoutColorMode === "dark",
      "layout-sidebar-light": this.state.layoutColorMode === "light",
    });

    return (
      <div className={wrapperClass} onClick={this.onWrapperClick}>
        <AppTopbar onToggleMenu={this.onToggleMenu} />

        <div ref={(el) => (this.sidebar = el)} className={sidebarClassName} onClick={this.onSidebarClick}>
          <div className="layout-logo">{/* <img alt="Logo" src={logo} /> */}</div>
          <AppProfile />
          <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
        </div>
        <GrowlProvider message={this.state.growlMsg} type={this.state.growlType} growlCallback={this.clearGrowl} />

        <div className="layout-main">
          <Route path="/" exact component={Dashboard} />
        </div>

        <div className="layout-mask"></div>
      </div>
    );
  }
}

export default withTranslation()(App);
