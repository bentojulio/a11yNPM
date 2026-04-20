import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./style.css";
import { Icon } from '../../Atoms/Icon';
import { BrowserRouter, Link } from "react-router-dom";

export const DashboardMenu = ({ menuItems, onMenuItemClick, activeItem, darkTheme, basename }) => {
    const [openSubmenu, setOpenSubmenu] = useState(
        localStorage.getItem("openSubmenu")
            ? JSON.parse(localStorage.getItem("openSubmenu"))
            : { id: null, label: "", icon: "" }
    );
    const [collapsed, setCollapsed] = useState(false);
    const theme = darkTheme ? "dark" : "";

    const persistOpen = (value) => {
        setOpenSubmenu(value);
        localStorage.setItem("openSubmenu", JSON.stringify(value));
    };

    const handleMenuClick = (item) => {
        if (item.submenu) {
            if (item.id === openSubmenu.id) {
                persistOpen({ id: null, label: "", icon: "" });
            } else {
                persistOpen(item);
            }
            onMenuItemClick(item);
        } else {
            onMenuItemClick(item);
            persistOpen({ id: null, label: "", icon: "" });
        }
    };

    const handleKeyDown = (e, item) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleMenuClick(item);
        }
    };

    useEffect(() => {
        if (activeItem) {
            const id = typeof activeItem === "object" ? activeItem?.id : activeItem;
            const activeMenuItem = menuItems.find(item => item.id === id);
            if (activeMenuItem && !activeMenuItem.submenu) {
                persistOpen({ id: null, label: "", icon: "" });
            }
        }
    }, [activeItem, menuItems]);

    const currentId = typeof activeItem === "object" ? activeItem?.id : activeItem;

    const toggleAside = () => setCollapsed(prev => !prev);

    return (
        <BrowserRouter basename={basename ? `/${basename}` : undefined}>
            <aside
                id="asideCol"
                className={`dashboard-menu ${theme} ${collapsed ? "collapsed" : ""}`}
            >
                <nav aria-label="menu principal do AMS">
                    <button
                        type="button"
                        id="toggleMenu"
                        className={`toggle-menu ${theme}`}
                        aria-controls="menu-ams"
                        aria-expanded={!collapsed}
                        aria-label={collapsed
                            ? "menu do AMS fechado. pressione se pretender abrir"
                            : "menu do AMS aberto. pressione se pretender fechar"}
                        onClick={toggleAside}
                    >
                        <Icon
                            name={collapsed ? "AMA-SetaDir-Line" : "AMA-SetaEsq-Line"}
                            darkTheme={darkTheme}
                        />
                        <span className="toggle-menu-label">Menu</span>
                    </button>

                    <ul
                        id="menu-ams"
                        aria-label="opções AMS"
                        className={`menu-list ${theme}`}
                        hidden={collapsed}
                    >
                        {menuItems.map((item) => {
                            const isParentOfActive = item.submenu && item.submenu.some(sub => sub.id === currentId);
                            const isActive = currentId === item.id;
                            const isSubmenuOpen = openSubmenu.id === item.id;
                            const submenuId = `submenu-${item.id}`;
                            const buttonId = `menu-${item.id}`;

                            if (item.submenu) {
                                return (
                                    <li
                                        key={item.id}
                                        className={`menu-item ${theme} ${isParentOfActive ? "parent-active" : ""}`}
                                    >
                                        <button
                                            type="button"
                                            id={buttonId}
                                            className={`menu-text ${theme} ${isParentOfActive ? "parent-active" : ""}`}
                                            aria-expanded={isSubmenuOpen}
                                            aria-controls={submenuId}
                                            aria-label={`${item.label}, contém submenu, atualmente ${isSubmenuOpen ? "aberto" : "fechado"}`}
                                            data-label={item.label}
                                            onClick={() => handleMenuClick(item)}
                                            onKeyDown={e => handleKeyDown(e, item)}
                                        >
                                            <Icon name={item.icon} darkTheme={darkTheme} />
                                            <span className="menu-label">{item.label}</span>
                                            <span className="indicator" aria-hidden="true">
                                                <Icon name="AMA-SetaBaixo2-Line" darkTheme={darkTheme} />
                                            </span>
                                        </button>

                                        <ul
                                            id={submenuId}
                                            className="submenu-list"
                                            aria-labelledby={buttonId}
                                            hidden={!isSubmenuOpen}
                                            aria-hidden={!isSubmenuOpen}
                                        >
                                            {item.submenu.map(sub => {
                                                const subActive = currentId === sub.id;
                                                return (
                                                    <li
                                                        key={sub.id}
                                                        className={`submenu-text ${theme} ${subActive ? "active" : ""}`}
                                                        aria-current={subActive ? "page" : undefined}
                                                    >
                                                        {subActive ? (
                                                            <span className="submenu-link current">
                                                                <Icon name={sub.icon} darkTheme={darkTheme} />
                                                                <span className="menu-label">{sub.label}</span>
                                                            </span>
                                                        ) : (
                                                            <Link
                                                                to={typeof sub.id === "object" ? sub.id.url : sub.id}
                                                                className="submenu-link"
                                                                onClick={() => onMenuItemClick(sub)}
                                                            >
                                                                <Icon name={sub.icon} darkTheme={darkTheme} />
                                                                <span className="menu-label">{sub.label}</span>
                                                            </Link>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            }

                            return (
                                <li
                                    key={item.id}
                                    className={`menu-item ${theme} ${isActive ? "active" : ""}`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {isActive ? (
                                        <span className={`menu-text ${theme} current`}>
                                            <Icon name={item.icon} darkTheme={darkTheme} />
                                            <span className="menu-label">{item.label}</span>
                                        </span>
                                    ) : (
                                        <Link
                                            to={typeof item.id === "object" ? item.id.url : item.id}
                                            className={`menu-text ${theme}`}
                                            onClick={() => handleMenuClick(item)}
                                            onKeyDown={e => handleKeyDown(e, item)}
                                        >
                                            <Icon name={item.icon} darkTheme={darkTheme} />
                                            <span className="menu-label">{item.label}</span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </BrowserRouter>
    );
};

DashboardMenu.propTypes = {
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            submenu: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    label: PropTypes.string.isRequired,
                    icon: PropTypes.string.isRequired
                })
            )
        })
    ).isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
    activeItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    darkTheme: PropTypes.bool,
    basename: PropTypes.string
};
