import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";

interface AppPropsSub {
  onMenuItemClick: Function;
  items: [];
  root: boolean;
  className: string;
  model: [];
}

interface AppState {
  activeIndex: any;
}

class AppSubmenu extends React.Component<AppPropsSub, AppState> {
  constructor(props: AppPropsSub) {
    super(props);
    this.state = { activeIndex: null };
  }

  onMenuItemClick(event: any, item: any, index: number) {
    //avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    //execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    if (index === this.state.activeIndex) this.setState({ activeIndex: null });
    else this.setState({ activeIndex: index });

    if (this.props.onMenuItemClick) {
      this.props.onMenuItemClick({
        originalEvent: event,
        item: item,
      });
    }
  }

  renderLinkContent(item: any) {
    let submenuIcon = item.items && (
      <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
    );
    let badge = item.badge && (
      <span className="menuitem-badge">{item.badge}</span>
    );

    return (
      <React.Fragment>
        <i className={item.icon}></i>
        <span>{item.label}</span>
        {submenuIcon}
        {badge}
      </React.Fragment>
    );
  }

  renderLink(item: any, i: number) {
    let content = this.renderLinkContent(item);

    if (item.to) {
      return (
        <NavLink
          activeClassName="active-route"
          to={item.to}
          onClick={(e: any) => this.onMenuItemClick(e, item, i)}
          exact
          target={item.target}
        >
          {content}
        </NavLink>
      );
    } else {
      return (
        <a
          href={item.url}
          onClick={(e) => this.onMenuItemClick(e, item, i)}
          target={item.target}
        >
          {content}
        </a>
      );
    }
  }

  render() {
    let items =
      this.props.items &&
      this.props.items.map((item: any, i: number) => {
        let active = this.state.activeIndex === i;
        let styleClass = classNames(item.badgeStyleClass, {
          "active-menuitem": active && !item.to,
        });

        return (
          <li className={styleClass} key={i}>
            {item.items && this.props.root === true && (
              <div className="arrow"></div>
            )}
            {this.renderLink(item, i)}
            <AppSubmenu
              {...this.props}
              items={item.items}
              onMenuItemClick={this.props.onMenuItemClick}
            />
          </li>
        );
      });

    return items ? <ul className={this.props.className}>{items}</ul> : null;
  }
}

interface AppProps {
  onMenuItemClick: Function;
  model: [];
}

export class AppMenu extends React.Component<AppProps, AppState> {
  render() {
    return (
      <div className="layout-menu-container">
        <AppSubmenu
          items={this.props.model}
          className="layout-menu"
          onMenuItemClick={this.props.onMenuItemClick}
          root={true}
          model={[]}
        />
      </div>
    );
  }
}
