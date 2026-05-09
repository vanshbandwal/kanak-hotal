import React from 'react';
import LuxuryInput from './LuxuryInput';
import LuxurySelect from './LuxurySelect';
import LuxuryButton from './LuxuryButton';
import './LuxuryTable.css';

export interface ColumnDef<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T, index: number) => React.ReactNode;
    width?: string;
    sortable?: boolean;
}

interface LuxuryTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    title: string;
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
}: LuxuryTableProps<T>) => {
    
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
            <div className="luxury-table-header">
                <div className="luxury-table-header-title-group">
                    <h3 className="luxury-table-title">{title}</h3>
                    {subtitle && <p className="luxury-table-subtitle">{subtitle}</p>}
                </div>
                <div className="luxury-table-header-actions">
                    {onImport && (
                        <LuxuryButton variant="outline" onClick={onImport} icon="📤">
                            Bulk Import
                        </LuxuryButton>
                    )}
                    {onExport && (
                        <LuxuryButton variant="outline" onClick={onExport} icon="📥">
                            Export Excel
                        </LuxuryButton>
                    )}
                    {onAdd && (
                        <LuxuryButton variant="primary" onClick={onAdd} icon="+">
                            {addButtonLabel}
                        </LuxuryButton>
                    )}
                </div>
            </div>

            <div className="luxury-table-filter-bar">
                <div className="luxury-table-search-container">
                    <LuxuryInput
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon="🔍"
                    />
                </div>
                <div className="luxury-table-entries-selector">
                    <LuxurySelect 
                        value={String(rowsPerPage)} 
                        onChange={(val) => onRowsPerPageChange?.(Number(val))}
                        options={[
                            { value: '10', label: '10' },
                            { value: '25', label: '25' },
                            { value: '50', label: '50' },
                            { value: '100', label: '100' }
                        ]}
                        searchable={false}
                        style={{ padding: '8px 12px', minWidth: '80px' }}
                    />
                </div>
            </div>

            <div className="luxury-table-scroll-container">
                <div style={{ position: 'relative' }}>
                    {isLoading && (
                        <div className="luxury-table-loading-overlay">
                            <div className="luxury-table-shimmer" />
                        </div>
                    )}
                    <table className="luxury-table" style={{ opacity: isLoading ? 0.6 : 1 }}>
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
                                                    <svg 
                                                        width="14" 
                                                        height="14" 
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="3" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                        className="luxury-table-sort-svg"
                                                        style={{
                                                            color: sortConfig?.key === col.key ? 'var(--primary)' : 'rgba(255,255,255,0.2)'
                                                        }}
                                                    >
                                                        <path 
                                                            d="M7 4v16M7 20l-4-4M7 20l4-4" 
                                                            style={{ 
                                                                opacity: sortConfig?.key === col.key && sortConfig.direction === 'asc' ? 1 : 0.4,
                                                            }} 
                                                        />
                                                        <path 
                                                            d="M17 20V4M17 4l-4 4M17 4l4 4" 
                                                            style={{ 
                                                                opacity: sortConfig?.key === col.key && sortConfig.direction === 'desc' ? 1 : 0.4,
                                                            }} 
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((item, rowIdx) => (
                                    <tr key={item._id || item.id || rowIdx} className="luxury-table-row">
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className="luxury-table-cell">
                                                {col.render ? (
                                                    col.render(item, (currentPage - 1) * rowsPerPage + rowIdx)
                                                ) : typeof item[col.key as keyof T] === 'boolean' ? (
                                                    <span 
                                                        className="luxury-table-status-badge"
                                                        style={{
                                                            backgroundColor: item[col.key as keyof T] ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                                            color: item[col.key as keyof T] ? '#4CAF50' : '#F44336'
                                                        }}
                                                    >
                                                        {item[col.key as keyof T] ? 'Active' : 'Inactive'}
                                                    </span>
                                                ) : (
                                                    (item[col.key as keyof T] as React.ReactNode)
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="luxury-table-empty-cell">
                                        {isLoading ? 'Loading luxury data...' : 'No data found'}
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
