import React, { useEffect, useState, useRef, useCallback } from "react";
import "./style.css";
import { Icon } from "../../Atoms/Icon"
import { Button } from "../../Atoms/Button"

/*
    hasSort -> If Table has sorting
    caption -> Table caption
    headers -> Custom Array of Headers
    dataList -> Array of data
    setDataList -> Set function to change the data shown based on sorting
    columnsOptions -> Custom array to help render the data cells
    nextPage -> Function used for the button click
    darkTheme -> If Dark theme activated or not
    pagination -> If Table has pagination
    itemsPaginationTexts -> Texts for the text telling how many items in that page out of the total
    nItemsPerPageTexts -> Texts for the selection of how many items per page (Pagination)
    iconsAltTexts -> Alternative texts for the icons of the data cells
    paginationButtonsTexts ->  texts for accessibility screen readers for the 4 buttons of pagination (Pagination)
    project -> name of project so that it works in multiple projects
    ariaLabels -> translations for aria-labels to help read "A", "AA", "AAA"
    setCheckboxesSelected -> method to change checkboxes states
    serverSidePagination -> If true, assumes dataList is already paginated by the server (no client-side slice)
*/
const SortingTable = (
    {
        hasSort,
        caption,
        headers,
        dataList,
        setDataList,
        columnsOptions,
        nextPage,
        darkTheme,
        pagination,
        itemsPaginationTexts,
        nItemsPerPageTexts,
        iconsAltTexts,
        paginationButtonsTexts,
        project,
        ariaLabels,
        setCheckboxesSelected,
        checkedItems = [],
        // New props for dynamic pagination
        totalItems, // total number of items (from endpoint)
        currentPage, // current page (controlled by parent)
        itemsPerPage, // items per page (controlled by parent)
        onPageChange, // function(pageNumber) => void
        onItemsPerPageChange, // function(itemsPerPage) => void
        paginationOptions, // array of numbers for items per page
        serverSidePagination = false, // if true, data is already paginated by server
        hasColAndRowspan = true, // if true, shows rowSpan, colSpan and scope properties
        // Accessibility texts for sorting
        sortingTexts = {
            none: " Sem ordenação",
            ascending: " Ordenação ascendente",
            descending: " Ordenação descendente"
        }
    }) => {

    //SORT
    const [sort, setSort] = useState({ property: null, type: "" });
    
    // Theme
    const theme = darkTheme;

    //Multi Headers?
    const multiHeaders = headers && Array.isArray(headers[0])

    // Internal state for uncontrolled mode
    const [internalPage, setInternalPage] = useState(1);
    const [internalItemsPerPage, setInternalItemsPerPage] = useState(50);

    // Determine if controlled or uncontrolled
    const isControlled = typeof currentPage === 'number';

    // Select-all checkbox ref for indeterminate state
    const selectAllRef = useRef(null);
    
    // Effective values
    const page = isControlled ? currentPage : internalPage;
    const nItemsCurrent = isControlled ? itemsPerPage : internalItemsPerPage;
    
    const nAllItems = typeof totalItems === 'number' ? totalItems : (dataList ? dataList.length : 0);
    const lastPage = Math.max(1, Math.ceil(nAllItems / nItemsCurrent));
    
    // Generate pagination options dynamically if not provided
    const defaultPaginationOptions = [10, 25, 50, 100, 250, 500].filter(opt => opt < nAllItems);
    
    const baseOptions = Array.isArray(paginationOptions) && paginationOptions.length > 0 ? paginationOptions : defaultPaginationOptions;
    const pageOptions = baseOptions[baseOptions.length - 1] === nAllItems ? baseOptions : [...baseOptions.filter(opt => opt < nAllItems), nAllItems];

    // Handlers
    const handlePageChange = (newPage) => {
        if (!isControlled) setInternalPage(newPage);
        if (onPageChange) onPageChange(newPage);
    };

    const sortByProperty = (property) => {
        let direction = 'asc';
        if (sort.property === property && sort.type === 'asc') {
            direction = 'desc';
        }
        setSort({ property, type: direction });

        if (!dataList) return [];

        return [...dataList].sort((a, b) => {
            const valA = a[property];
            const valB = b[property];
            
            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            // Check if both values are numbers or numeric strings
            const numA = typeof valA === 'number' ? valA : parseFloat(valA);
            const numB = typeof valB === 'number' ? valB : parseFloat(valB);
            
            // If both are valid numbers (including numeric strings), sort numerically
            if (!isNaN(numA) && !isNaN(numB)) {
                return direction === 'asc' ? numA - numB : numB - numA;
            }
            
            // Otherwise, sort as strings
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            if (strA < strB) return direction === 'asc' ? -1 : 1;
            if (strA > strB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // For server-side pagination, data is already paginated, so don't slice it
    // For client-side pagination, slice the data to show only the current page
    const visibleData = serverSidePagination 
        ? (dataList || [])
        : (dataList ? dataList.slice((page - 1) * nItemsCurrent, (page - 1) * nItemsCurrent + nItemsCurrent) : []);

    // Visible rows info (current page)
    const visibleIds = visibleData.map(row => row.id);
    const visibleCount = visibleIds.length;
    const selectedVisibleCount = checkedItems.filter(item => visibleIds.includes(item.id)).length;

    // Global selection state (all selectable items with valid id)
    const selectableItems = dataList
        ? dataList.filter(row => row && row.id !== undefined && row.id !== null)
        : [];
    const totalItemsCount = selectableItems.length;
    const totalSelectedCount = checkedItems.filter(
        item => item && item.id !== undefined && item.id !== null
    ).length;
    // All checked = every selectable item id is present in checkedItems (ignoring extras)
    const isAllChecked =
        totalItemsCount > 0 &&
        selectableItems.every(row =>
            checkedItems.some(item => item && item.id === row.id)
        );
    // Indeterminate = at least one selectable item selected, but not all
    const isIndeterminate =
        totalItemsCount > 0 &&
        !isAllChecked &&
        selectableItems.some(row =>
            checkedItems.some(item => item && item.id === row.id)
        );

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate]);

    // Checkbox Handler
    const addCheckboxes = (value) => {
        if (!setCheckboxesSelected) return;
        
        if (value === 'all') {
            if (serverSidePagination) {
                // SERVER-SIDE PAGINATION:
                // Toggle selection only for currently visible rows (API only returned this page)
                const allVisibleSelected = visibleCount > 0 && selectedVisibleCount === visibleCount;
                if (allVisibleSelected) {
                    // Unselect all visible rows, keep selections from other pages/requests
                    const remaining = checkedItems.filter(item => !visibleIds.includes(item.id));
                    setCheckboxesSelected(remaining);
                } else {
                    // Select all visible rows, preserving existing selections and avoiding duplicates
                    const newSelected = [...checkedItems];
                    visibleData.forEach(row => {
                        if (!newSelected.some(item => item.id === row.id)) {
                            newSelected.push(row);
                        }
                    });
                    setCheckboxesSelected(newSelected);
                }
            } else {
                // CLIENT-SIDE PAGINATION:
                // We have all items in dataList in memory
                if (isAllChecked) {
                    // Unselect all items that belong to this table (selectableItems)
                    const remaining = checkedItems.filter(
                        item => !selectableItems.some(row => row.id === item.id)
                    );
                    setCheckboxesSelected(remaining);
                } else {
                    // Select all items with valid ids for this table
                    const newSelected = [...checkedItems];
                    selectableItems.forEach(row => {
                        if (!newSelected.some(item => item.id === row.id)) {
                            newSelected.push(row);
                        }
                    });
                    setCheckboxesSelected(newSelected);
                }
            }
        } else {
            const index = checkedItems.findIndex(item => item.id === value.id);
            if (index === -1) {
                setCheckboxesSelected([...checkedItems, value]);
            } else {
                const newChecked = [...checkedItems];
                newChecked.splice(index, 1);
                setCheckboxesSelected(newChecked);
            }
        }
    }

    const handleItemsPerPageChange = (newVal) => {
        if (!isControlled) setInternalItemsPerPage(newVal);
        if (onItemsPerPageChange) onItemsPerPageChange(newVal);
    };

    const renderHeader = (headerData, index) => {
        const nOfRows = headerData.rowSpan || headerData.nRow || 1
        const nOfColumns = headerData.colSpan || headerData.nCol || 1
        const noPointer = !hasSort ? 'no_pointer' : ""
        const sameProp = sort.property === headerData.property
        const textCenter = headerData.justifyCenter ? "text-center" : ""
        const bigWidth = headerData.bigWidth ? headerData.bigWidth : "auto"
        const id = headerData.id ? headerData.id : null;
        
        const conditionalProps = hasColAndRowspan ? {
            rowSpan: nOfRows,
            colSpan: nOfColumns,
            scope: "col"
        } : {};
        
        switch (headerData.type) {
            case "Empty":
                return (  <th id={multiHeaders ? id : null} key={index} style={{ width: bigWidth }} {...conditionalProps} className={`no_pointer`}>
                    <span className="visually-hidden">{headerData.name}</span>
                    </th>
            )
            case "Text":
                return (<th id={multiHeaders ? id : null} aria-label={headerData.ariaLabel ? ariaLabels[headerData.name] : null} key={index} style={{ width: bigWidth }} {...conditionalProps} className={`${textCenter} no_pointer`}>
                    <span className="ama-typography-body text-center bold">{headerData.name}</span>
                </th>)
            case "SortingText":
                let justifyCenter = headerData.justifyCenter ? "justify-content-center" : ""
                const getSortState = () => {
                    if (!sameProp) return "none";
                    return sort.type === "desc" ? "descending" : "ascending";
                }
                const getSortStateText = () => {
                    if (!sameProp) return sortingTexts.none;
                    return sort.type === "desc" ? sortingTexts.descending : sortingTexts.ascending;
                }
                const sortingTextProps = hasColAndRowspan ? {
                    rowSpan: nOfRows,
                    colSpan: nOfColumns,
                    scope: headerData.scope ? headerData.scope : "col"
                } : {};
                return (
                    <th id={multiHeaders ? id : null} key={index} style={{ width: bigWidth }} {...sortingTextProps} aria-sort={getSortState()}>
                        <button
                            type="button"
                            className={`sorting-header-button ${sameProp ? 'show_icon' : ''}`}
                            onClick={() => setDataList(sortByProperty(headerData.property))}
                        >
                            {headerData.name}
                            <span className="arrow" aria-hidden="true">
                                {sameProp ?
                                    (sort.type === "desc" ? <Icon name="AMA-SetaBaixo-Line" /> : <Icon name="AMA-SetaCima-Line" />) :
                                    <Icon name="AMA-SetaCima-Line" />
                                }
                            </span>
                            <span className="visually-hidden">{getSortStateText()}</span>
                        </button>
                    </th>
                )
            case "Icon":
                return (
                    <th id={multiHeaders ? id : null} key={index} style={{ width: bigWidth }} {...conditionalProps} className={`${textCenter} ${noPointer} first-show`}>
                        <Icon name={headerData.name} />
                        <span className="visually-hidden">{headerData.description}</span>
                    </th>
                )
            case "SortingIcon":
                const getSortStateIcon = () => {
                    if (!sameProp) return "none";
                    return sort.type === "desc" ? "descending" : "ascending";
                }
                const getSortStateTextIcon = () => {
                    if (!sameProp) return sortingTexts.none;
                    return sort.type === "desc" ? sortingTexts.descending : sortingTexts.ascending;
                }
                return (
                    <th id={multiHeaders ? id : null} key={index} style={{ width: bigWidth }} {...conditionalProps} aria-sort={getSortStateIcon()}>
                        <button
                            type="button"
                            className={`sorting-header-button first-show ${sameProp ? 'show_icon' : ''}`}
                            onClick={() => setDataList(sortByProperty(headerData.property))}
                        >
                            <Icon name={headerData.name} description={headerData.description} />
                            <span className="arrow" aria-hidden="true">
                                {sameProp ?
                                    (sort.type === "desc" ? <Icon name="AMA-SetaBaixo-Line" /> : <Icon name="AMA-SetaCima-Line" />) :
                                    <Icon name="AMA-SetaCima-Line" />
                                }
                            </span>
                            <span className="visually-hidden">{headerData.description} - {getSortStateTextIcon()}</span>
                        </button>
                    </th>
                )
            case "Checkbox":
                return (<th id={multiHeaders ? id : null} key={index} style={{ width: bigWidth }} {...conditionalProps} className={`${textCenter} checkbox px-4`}>
                    <input
                        ref={selectAllRef}
                        type="checkbox"
                        aria-label="selecionar registos"
                        checked={isAllChecked}
                        onChange={() => addCheckboxes('all')}
                        value="all"
                    />
                </th>)
        }
    }


    const renderSpans = (spans) => {
        return spans.map((span, index) => {
            return (<span key={index} className="ama-typography-body mb-1">{span}</span>)
        })
    }

    // Function that renders the individual cells on the table
    // We receive an entire data row, then we go 1 by 1 on the properties of the object
    // Then we also get help from our --> columnsOptions
    // This custom array passed to the component helps us know what to render and what specifics for each cell
    // the custom array will have the same exact properties and for each one will tell if its a Text or a Number or an Icon ...
    const renderAttributes = (row) => {
        return Object.keys(row).map((key, index) => {
            // Safety check: skip if columnsOptions doesn't have this key
            if (!columnsOptions || !columnsOptions[key]) {
                return null;
            }
            
            let center = columnsOptions[key].center ? "text-center" : ""
            let bold = columnsOptions[key].bold ? "bold" : ""
            // Use the custom array to check the type of render to do
            switch (columnsOptions[key].type) {
                case "Skip":
                    // Don't render this property
                    return null
                case "Number":
                    // Render a number, if it has "decimalPlace" as TRUE then render the number with 1 decimal place
                    return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}>{columnsOptions[key].decimalPlace ? row[key]?.toFixed(1) : row[key]}</td>)
                case "Button":
                    let button = columnsOptions[key].onClick ? columnsOptions[key].onClick : () => { return "" }
                    return (<td headers={columnsOptions[key].headers} key={index} className={`${center}`} style={{ justifyItems: "center" }}>
                        <Button
                            darkTheme={theme}
                            className={`${columnsOptions[key].class}`}
                            variant={columnsOptions[key].variant}
                            text={columnsOptions[key].text}
                            disabled={columnsOptions[key].disabled}
                            onClick={button ? () => button(row, key) : null}
                        />
                    </td>)
                case "ButtonOrLink":
                    let hasDeclaration = columnsOptions[key].checkDeclaration ? (row["declaration"] !== null ? true : false) : true
                    let buttonAction = columnsOptions[key].onClick ? columnsOptions[key].onClick : () => { return "" }
                    let hrefButtonOrLink = columnsOptions[key].href ? columnsOptions[key].href : () => { return "" }
                    // Render a button
                    if (columnsOptions[key].checkDeclaration && (!hasDeclaration || row["declaration"] !== 3)) {
                        return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}>{columnsOptions[key].noDeclaration}</td>)
                    } else {
                        switch (row[key]) {
                            case null:
                                return (<td headers={columnsOptions[key].headers} key={index} className={`${center}`} style={{ justifyItems: "center" }}>
                                    <Button
                                        darkTheme={theme}
                                        className={`${columnsOptions[key].class}`}
                                        variant={columnsOptions[key].variant}
                                        text={columnsOptions[key].text}
                                        onClick={buttonAction ? () => buttonAction(row, key) : null}
                                    />
                                </td>)
                            default:
                                return (<td headers={columnsOptions[key].headers} key={index} className={`${center}`}><a href={hrefButtonOrLink(row)} className="ama-typography-action-large bold text-center">{columnsOptions[key].options[row[key]]}</a></td>)
                        }
                    }
                case "Link":
                    let href = columnsOptions[key].href ? columnsOptions[key].href : () => { return "" }
                    // Render a link
                    // Check if this column should act as a label for the checkbox
                    // When it's a link, we create an id for the link and use aria-labelledby on the checkbox
                    if (columnsOptions[key].isCheckboxLabel) {
                        const linkId = `link_${row.id}_${key}`;
                        return columnsOptions[key].children ? 
                            <td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`} >{columnsOptions[key].children(row, row[key])}</td> : 
                            <td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`} ><a href={href(row)} className="ama-typography-body bold" id={linkId}>{row[key]}</a></td>
                    }
                    return columnsOptions[key].children ? <td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}>{columnsOptions[key].children(row, row[key])}</td> : <td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><a href={href(row)} className="ama-typography-body bold">{row[key]}</a></td>
                case "Text":
                    // Render normal text
                    // Check if this column should act as a label for the checkbox
                    if (columnsOptions[key].isCheckboxLabel) {
                        if (columnsOptions[key].ariaLabel) {
                            return (<td headers={columnsOptions[key].headers} key={index} aria-label={ariaLabels[row[key]]} className={`${center} ${bold} ama-typography-body`}><label htmlFor={`checkbox_${row.id}`}>{row[key]}</label></td>)
                        } else {
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}><label htmlFor={`checkbox_${row.id}`}>{row[key]}</label></td>)
                        }
                    }   
                    if (columnsOptions[key].ariaLabel) {
                        return (<td headers={columnsOptions[key].headers} key={index} aria-label={ariaLabels[row[key]]} className={`${center} ${bold} ama-typography-body`}>{row[key]}</td>)
                    } else {
                        return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}>{row[key]}</td>)
                    }
                case "Stamp":
                    // Render one of the 3 Stamp Icons based on the number received (from: 1 to 3)
                    const stampAlts = iconsAltTexts && iconsAltTexts.length >= 3 ? iconsAltTexts : [
                        "Selo Bronze", "Selo Prata", "Selo Ouro"
                    ];
                    switch (row[key]) {
                        case 1:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><img src={`${project}img/SVG_Selo_Bronze.svg`} alt={stampAlts[0]} /></td>)
                        case 2:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><img src={`${project}img/SVG_Selo_Prata.svg`} alt={stampAlts[1]} /></td>)
                        case 3:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><img src={`${project}img/SVG_Selo_Ouro.svg`} alt={stampAlts[2]} /></td>)
                        default:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}>{row[key]}</td>)
                    }
                case "Declaration":
                    // Render one of the 3 Declaration Icons based on the number received (from: 1 to 3)
                    const declarationAlts = iconsAltTexts && iconsAltTexts.length >= 6 ? iconsAltTexts.slice(3, 6) : [
                        "Declaração Não Conforme", "Declaração Parcialmente Conforme", "Declaração Conforme"
                    ];
                    switch (row[key]) {
                        case 1:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><img src={`${project}img/SVG_Declaracao_Nao_Conforme.svg`} alt={declarationAlts[0]} /></td>)
                        case 2:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><img src={`${project}img/SVG_Declaracao_Parcial_Conforme.svg`} alt={declarationAlts[1]} /></td>)
                        case 3:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><img src={`${project}img/SVG_Declaracao_Conforme.svg`} alt={declarationAlts[2]} /></td>)
                        default:
                            return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}>{row[key]}</td>)
                    }
                case "MultiText":
                    // Render 2 or more spans that are all normal text.
                    return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} d-flex flex-column multi-text`}>{renderSpans(row[key])}</td>)
                case "DoubleText":
                    // Render 2 texts where the second one is bold and the first one not. If this property also comes with bold then all text will be bold
                    return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold}`}><span className="ama-typography-body">{row[key][0]}</span><span className="ama-typography-body bold">{row[key][1]}</span></td>)
                case "DangerousHTML":
                    const hasCode = row[key].includes("<code>")
                    const hasMark = row[key].includes("<mark>")
                    const hasMeta = row[key].includes("<meta")
                    if (hasCode || hasMark || hasMeta) {
                        return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}>
                            <span
                                className="span_code"
                                dangerouslySetInnerHTML={{ __html: row[key] }}
                            />
                        </td>)
                    } else {
                        return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}>{row[key]}</td>)
                    }
                case "Checkbox":
                    // Find if any column is marked as checkbox label
                    const labelColumn = Object.keys(columnsOptions).find(k => columnsOptions[k].isCheckboxLabel);
                    const isLinkLabel = labelColumn && columnsOptions[labelColumn].type === "Link";
                    const ariaLabelledBy = isLinkLabel ? `link_${row.id}_${labelColumn}` : undefined;
                    
                    return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ama-typography-body checkbox`}>
                                <input 
                                    type="checkbox" 
                                    id={`checkbox_${row.id}`} 
                                    name={row.id} 
                                    value={`${row}`} 
                                    checked={checkedItems.findIndex(item => item.id === row.id) !== -1} 
                                    onChange={() => addCheckboxes(row)}
                                    aria-labelledby={ariaLabelledBy}
                                ></input>
                            </td>)
                default:
                    // Default case: render as plain text
                    return (<td headers={columnsOptions[key].headers} key={index} className={`${center} ${bold} ama-typography-body`}>{row[key]}</td>)
            }
        })
    }

    const tableId = `sorting-table-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`ama sorting_table_responsive ${theme}`}>
            <table id={tableId} className="table sorting_table" data-sortable="true">
                {/* Table caption -> descripton of the table */}
                <caption>
                    {caption}
                </caption>
                <thead>
                    {/* Check if the array has multiple sub-arrays or not
                        If Yes then means theres more than 1 row of headers
                        If No then it's just 1 row of headers
                    */}
                    {headers && multiHeaders ?
                        // Multiple rows of headers
                        headers.map((row, index) => {
                            return (<tr key={index}>{row.map((th, index) => { return renderHeader(th, index) })}</tr>)
                        })
                        :
                        <>
                            {/* Just 1 row of headers */}
                            <tr>
                                {headers.map((th, index) => {
                                    return renderHeader(th, index)
                                })}
                            </tr>
                        </>
                    }
                </thead>

                <tbody>
                    {/* Render the data cells of the table */}
                    {visibleData && visibleData.map((row, index) => {
                        return (
                            <tr key={index}>
                                {renderAttributes(row)}
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={multiHeaders ? headers.map(header => header.length).reduce((a, b) => a + b, 0) : headers.length}>(*) Nota: conformidade para com as <a href="https://www.w3.org/TR/WCAG21/"><abbr title="Web Content Accessibility Guidelines">WCAG</abbr> do <abbr title="World Wide Web Consortium">W3C</abbr></a>.</td>
                    </tr>
                </tfoot>
            </table>

            {/* Pagination */}
            {pagination && <div className={`d-flex flex-row justify-content-between pagination ${theme}`}>
                {/* Section informing the number of items in that page from the total*/}
                <div className="ama-typography-body pagination_section">
                    {((page - 1) * nItemsCurrent) + 1 + " - " + (nAllItems > nItemsCurrent && page !== lastPage ? (page * nItemsCurrent) : nAllItems) + itemsPaginationTexts[0] + nAllItems + itemsPaginationTexts[1]}
                </div>

                {/* Section informing the number of items per page and option to change */}
                <nav className="pagination_section" aria-label="itens por página">
                    <span className="ama-typography-body">{nItemsPerPageTexts[0]}</span>
                    <select
                        aria-label={nItemsPerPageTexts[2]}
                        className="selection"
                        name="itemsPerPage"
                        id="itemsPerPage"
                        value={nItemsCurrent}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    >
                        {pageOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <span className="ama-typography-body">{nItemsPerPageTexts[1]}</span>
                </nav>

                {/* Section with the pagination navigation */}
                <nav className="pagination_section" aria-label="páginas" >
                    <button disabled={page === 1} className={page === 1 ? "disabled button_dir" : "button_dir"} onClick={() => handlePageChange(1)}>
                        <span className="visually-hidden">{paginationButtonsTexts[0]}</span>
                        <Icon name="AMA-LastPage-Solid" />
                    </button>
                    <button disabled={page === 1} className={page === 1 ? "disabled button_dir" : " button_dir"} onClick={() => handlePageChange(page - 1)}>
                        <span className="visually-hidden">{paginationButtonsTexts[1]}</span>
                        <Icon name="AMA-SetaDir3-Solid" />
                    </button>
                    <button disabled={page === lastPage} className={page === lastPage ? "disabled" : ""} onClick={() => handlePageChange(page + 1)}>
                        <span className="visually-hidden">{paginationButtonsTexts[2]}</span>
                        <Icon name="AMA-SetaDir3-Solid" />
                    </button>
                    <button disabled={page === lastPage} className={page === lastPage ? "disabled" : ""} onClick={() => handlePageChange(lastPage)}>
                        <span className="visually-hidden">{paginationButtonsTexts[3]}</span>
                        <Icon name="AMA-LastPage-Solid" />
                    </button>
                </nav>
            </div>}
        </div>
    );
};

export { SortingTable };