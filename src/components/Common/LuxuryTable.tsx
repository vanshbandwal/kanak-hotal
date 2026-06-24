import React from 'react';
import LuxuryInput from './LuxuryInput';
import LuxurySelect from './LuxurySelect';
import LuxuryButton from './LuxuryButton';
import LuxuryStatusBadge from './LuxuryStatusBadge';
import LuxuryEmptyState from './LuxuryEmptyState';
import LuxurySkeleton from './LuxurySkeleton';
import LuxuryPageHeader from './LuxuryPageHeader';
import './LuxuryTable.css';

export interface ColumnDef<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T, index: number) => React.ReactNode;
    width?: string;
    sortable?: boolean;
}

export interface LuxuryTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    title?: string;
    subtitle?: string;
    onAdd?: () => void;
    onExport?: () => void;
    onImport?: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    addButtonLabel?: string;
    totalCount?: number;
    currentPage?: number;
    rowsPerPage?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (count: number) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' };
    onSortChange?: (config: { key: string; direction: 'asc' | 'desc' }) => void;
    isLoading?: boolean;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    renderExpandedRow?: (item: T) => React.ReactNode;
    isRowExpandable?: (item: T) => boolean;
    extraFilters?: React.ReactNode;
}


const LuxuryTable = <T extends { _id?: string; id?: string | number }>({
    columns,
    data,
    title,
    subtitle,
    onAdd,
    onExport,
    onImport,
    searchTerm,
    onSearchChange,
    addButtonLabel = 'ADD NEW',
    totalCount = 0,
    currentPage = 1,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    sortConfig,
    onSortChange,
    isLoading = false,
    emptyIcon = '💎',
    emptyTitle = 'No Records Found',
    emptyDescription = 'Our archives seem to be missing this selection. Try refining your search or add a new entry.',
    renderExpandedRow,
    isRowExpandable,
    extraFilters
}: LuxuryTableProps<T>) => {
    const [expandedRows, setExpandedRows] = React.useState<Set<string | number>>(new Set());

    const toggleRow = (id: string | number) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    
    const handleSortClick = (column: ColumnDef<T>) => {
        if (!column.sortable || !onSortChange) return;
        
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === column.key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        
        onSortChange({ key: column.key as string, direction });
    };

    const renderPagination = () => {
        if (!onPageChange || totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return (
            <div className="luxury-table-pagination-container">
                <div className="luxury-table-pagination-info">
                    Showing {Math.min(totalCount, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(totalCount, currentPage * rowsPerPage)} of {totalCount} entries
                </div>
                <div className="luxury-table-pagination-controls">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="luxury-table-page-button"
                    >
                        ‹
                    </button>
                    
                    {start > 1 && (
                        <>
                            <button onClick={() => onPageChange(1)} className="luxury-table-page-button">1</button>
                            {start > 2 && <span className="luxury-table-pagination-ellipsis">...</span>}
                        </>
                    )}
                    
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`luxury-table-page-button ${currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    {end < totalPages && (
                        <>
                            {end < totalPages - 1 && <span className="luxury-table-pagination-ellipsis">...</span>}
                            <button onClick={() => onPageChange(totalPages)} className="luxury-table-page-button">{totalPages}</button>
                        </>
                    )}
                    
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="luxury-table-page-button"
                    >
                        ›
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="luxury-table-wrapper">
            <div className="luxury-table-filter-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="luxury-table-search-container" style={{ flex: '8' }}>
                    <LuxuryInput
                        type="text"
                        placeholder="Search archives..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon="🔍"
                    />
                </div>
                <div className="luxury-table-entries-selector" style={{ flex: '1', minWidth: '120px' }}>
                    <LuxurySelect 
                        value={String(rowsPerPage)} 
                        onChange={(val) => onRowsPerPageChange?.(Number(val))}
                        options={[
                            { value: '10', label: '10 Entries' },
                            { value: '25', label: '25 Entries' },
                            { value: '50', label: '50 Entries' }
                        ]}
                        searchable={false}
                    />
                </div>
                {extraFilters && (
                    <div className="luxury-table-extra-filters" style={{ flex: '1', minWidth: '150px' }}>
                        {extraFilters}
                    </div>
                )}
                {onAdd && (
                    <div className="luxury-table-add-action">
                        <LuxuryButton onClick={onAdd} style={{ padding: '8px 16px', height: '100%', minHeight: '40px' }}>
                            <span className="btn-icon-spacing">＋</span>
                            {addButtonLabel}
                        </LuxuryButton>
                    </div>
                )}
            </div>

            <div className="luxury-table-scroll-container">
                <div style={{ position: 'relative' }}>
                    <table className="luxury-table">
                        <thead>
                            <tr className="luxury-table-head-row">
                                {columns.map((col, idx) => (
                                    <th 
                                        key={idx} 
                                        className="luxury-table-head"
                                        style={{ 
                                            width: col.width,
                                            cursor: col.sortable ? 'pointer' : 'default'
                                        }}
                                        onClick={() => handleSortClick(col)}
                                    >
                                        <div className="luxury-table-header-cell-content">
                                            {col.header}
                                            {col.sortable && (
                                                <div className="luxury-table-sort-container">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="luxury-table-sort-svg">
                                                        <path d="M7 4v16M7 20l-4-4M7 20l4-4" style={{ opacity: sortConfig?.key === col.key && sortConfig.direction === 'asc' ? 1 : 0.4 }} />
                                                        <path d="M17 20V4M17 4l-4 4M17 4l4 4" style={{ opacity: sortConfig?.key === col.key && sortConfig.direction === 'desc' ? 1 : 0.4 }} />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, rIdx) => (
                                    <tr key={rIdx} className="luxury-table-row">
                                        {columns.map((_, cIdx) => (
                                            <td key={cIdx} className="luxury-table-cell">
                                                <LuxurySkeleton variant="text" height={20} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data && data.length > 0 ? (
                                data.map((item, rowIdx) => {
                                    const rowId = item._id || item.id || rowIdx;
                                    const isExpanded = expandedRows.has(rowId);
                                    const expandable = isRowExpandable ? isRowExpandable(item) : !!renderExpandedRow;

                                    return (
                                        <React.Fragment key={rowId}>
                                            <tr className={`luxury-table-row ${isExpanded ? 'expanded' : ''} ${expandable ? 'expandable' : ''}`} onClick={() => expandable && toggleRow(rowId)}>
                                                {columns.map((col, colIdx) => (
                                                    <td key={colIdx} className="luxury-table-cell">
                                                        {col.render ? (
                                                            col.render(item, (currentPage - 1) * rowsPerPage + rowIdx)
                                                        ) : typeof item[col.key as keyof T] === 'boolean' ? (
                                                            <LuxuryStatusBadge 
                                                                label={item[col.key as keyof T] ? 'Active' : 'Inactive'}
                                                                variant={item[col.key as keyof T] ? 'success' : 'danger'}
                                                            />
                                                        ) : (
                                                            (item[col.key as keyof T] as React.ReactNode)
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                            {isExpanded && renderExpandedRow && (
                                                <tr className="luxury-table-expanded-row">
                                                    <td colSpan={columns.length} style={{ padding: 0 }}>
                                                        {renderExpandedRow(item)}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={columns.length}>
                                        <LuxuryEmptyState 
                                            icon={emptyIcon}
                                            title={emptyTitle}
                                            description={emptyDescription}
                                            actionLabel={onAdd ? addButtonLabel : undefined}
                                            onAction={onAdd}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {renderPagination()}
        </div>
    );
};

export default LuxuryTable;

