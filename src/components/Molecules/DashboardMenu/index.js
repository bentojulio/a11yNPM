import React, { act, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./style.css";
import { Icon } from '../../Atoms/Icon';
import { BrowserRouter, Link } from "react-router-dom";

export const DashboardMenu = ({ menuItems, onMenuItemClick, activeItem, darkTheme, basename}) => {
    const [openSubmenu, setOpenSubmenu] = useState(localStorage.getItem("openSubmenu") ? JSON.parse(localStorage.getItem("openSubmenu")) : { id: null, label: "", icon: "" });
    const theme = darkTheme ? "dark" : "";

    const handleKeyDown = (e, item, index) => {
        if (e.key === "Enter" || e.key === " ") {
            handleMenuClick(item);
        } else if (e.key === "ArrowDown") {
            const next = document.querySelectorAll('.menu-item')[index + 1];
            if (next) next.focus();
        } else if (e.key === "ArrowUp") {
            const prev = document.querySelectorAll('.menu-item')[index - 1];
            if (prev) prev.focus();
        }
    };

    const handleMenuClick = (item) => {
        if (item.submenu) {
            if (item.id === openSubmenu.id) {
                setOpenSubmenu({ id: null, label: "", icon: "" });
                localStorage.setItem("openSubmenu", JSON.stringify({ id: null, label: "", icon: "" }));
            } else {
                setOpenSubmenu(item);
                localStorage.setItem("openSubmenu", JSON.stringify(item));
            }
            onMenuItemClick(item);
        } else {
            onMenuItemClick(item);
            setOpenSubmenu({ id: null, label: "", icon: "" });
            localStorage.setItem("openSubmenu", JSON.stringify({ id: null, label: "", icon: "" }));
        }
    };

    useEffect(() => {
        if (activeItem) {
            const activeMenuItem = menuItems.find(item => item.id === activeItem);
            if (activeMenuItem) {
                setOpenSubmenu({ id: null, label: "", icon: "" });
            }
        }
    }, [activeItem, menuItems]);
    return (
        <nav className={`dashboard-menu ${theme}`} aria-label="menu principal do AMS">
            <ul className={`menu-list ${theme}`}>
                {menuItems.map((item, index) => {
                    const isActive = activeItem.id === item.id ||
                        (item.submenu && item.submenu.some(sub => sub.id === activeItem.id));
                    const isSubmenuOpen = openSubmenu.id === item.id;

                    return (
                        <BrowserRouter basename={`/${basename}`}>
                        <li
                            key={item.id}
                            className={`menu-item ${theme} ${isActive ? "parent-active" : ""}`}
                        >
                            {item.submenu ? (
                                // Menu item with submenu - use button
                                <button 
                                    type="button"
                                    className={`menu-text ${theme} ${isActive ? `parent-active ${item.id === activeItem.id ? "active" :  ""}` : ""}`}
                                    aria-expanded={isSubmenuOpen}
                                    aria-controls={`submenu-${item.id}`}
                                    id={`menu-${item.id}`}
                                    aria-label={`${item.label}, contém submenu, atualmente ${isSubmenuOpen ? 'aberto' : 'fechado'}`}
                                    onClick={() => handleMenuClick(item)}
                                    onKeyDown={e => handleKeyDown(e, item, index)}
                                   
                                >
                                    <Icon name={item.icon} darkTheme={darkTheme} />
                                    <span className="menu-label text-center">{item.label}</span>
                                    <span className="indicator" aria-hidden="true">
                                        {isSubmenuOpen 
                                            ? <Icon name="AMA-SetaCima2-Line" darkTheme={darkTheme === "dark"} />
                                            : <Icon name="AMA-SetaBaixo2-Line" darkTheme={darkTheme === "dark"} />
                                        }
                                    </span>
                                </button>
                            ) : (
                                // Menu item without submenu - use button
                                <Link
                                    type="button"
                                    to={typeof item.id === "object" ? item.id.url : item.id}
                                    className={`menu-text ${theme} ${isActive ? `parent-active ${item.id === activeItem.id ? "active" :  ""}` : ""}`}
                                    onClick={() => handleMenuClick(item)}
                                    onKeyDown={e => handleKeyDown(e, item, index)}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon name={item.icon} darkTheme={darkTheme} />
                                    <span className="menu-label text-center">{item.label}</span>
                                </Link>
                            )}

                            {item.submenu && (
                                <ul
                                    id={`submenu-${item.id}`}
                                    className={`submenu-list${isSubmenuOpen ? " open" : ""}`}
                                    aria-labelledby={`menu-${item.id}`}
                                    hidden={!isSubmenuOpen}
                                    style={{ display: isSubmenuOpen ? "block" : "none" }}
                                    aria-label={`Submenu de ${item.label}`}
                                >
                                    {item.submenu.map((sub, subIdx) => (
                                        <li
                                            key={sub.id}
                                            className={`submenu-text ${theme} ${isActive ? "parent-active" : ""} ${activeItem.id === sub.id ? "active" : ""}`}
                                        >
                                            <Link
                                                to={typeof sub.id === "object" ? sub.id.url : sub.id}
                                                className="submenu-link"
                                                onClick={() => onMenuItemClick(sub)}
                                                onKeyDown={e => handleKeyDown(e, sub, subIdx)}
                                                aria-current={activeItem.id === sub.id ? "page" : undefined}
                                            >
                                                <Icon name={sub.icon} darkTheme={darkTheme} />
                                                <span className="menu-label">{sub.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        </BrowserRouter>
                    );
                })}
            </ul>
        </nav>
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
    activeItem: PropTypes.string,
    darkTheme: PropTypes.bool
};
