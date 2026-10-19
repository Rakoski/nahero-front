"use client";

import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type RowData,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

export interface DataTableHandle {
  scrollToIndex: (index: number) => void;
}

export interface DataTableVirtualOptions {
  estimateRowHeight: number;
  scrollPaddingStart?: number;
  scrollPaddingEnd?: number;
  overscan?: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  emptyMessage?: ReactNode;
  virtual?: DataTableVirtualOptions;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  activeRowIndex?: number;
  onRowPointerDown?: (index: number) => void;
  onRowClick?: (row: TData, event: MouseEvent<HTMLTableRowElement>) => void;
  rowClassName?: string;
  className?: string;
  ref?: Ref<DataTableHandle>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,
  rowSelection,
  onRowSelectionChange,
  emptyMessage,
  virtual,
  onEndReached,
  endReachedThreshold = 8,
  activeRowIndex,
  onRowPointerDown,
  onRowClick,
  rowClassName,
  className,
  ref,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: rowSelection !== undefined,
    onRowSelectionChange,
    state: rowSelection === undefined ? {} : { rowSelection },
  });
  const rows = table.getRowModel().rows;

  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const element = bodyRef.current;
    if (!virtual || !element) return;
    const measure = () => setScrollMargin(element.getBoundingClientRect().top + window.scrollY);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [virtual]);

  const virtualizer = useWindowVirtualizer({
    count: virtual ? rows.length : 0,
    estimateSize: () => virtual?.estimateRowHeight ?? 0,
    overscan: virtual?.overscan ?? 10,
    scrollMargin,
    scrollPaddingStart: virtual?.scrollPaddingStart,
    scrollPaddingEnd: virtual?.scrollPaddingEnd,
  });

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => {
        if (virtual) virtualizer.scrollToIndex(index, { align: "auto" });
        else bodyRef.current?.children[index]?.scrollIntoView({ block: "nearest" });
      },
    }),
    [virtual, virtualizer],
  );

  const virtualItems = virtual ? virtualizer.getVirtualItems() : [];
  const lastRendered = virtual ? (virtualItems.at(-1)?.index ?? -1) : rows.length - 1;

  useEffect(() => {
    if (onEndReached && rows.length > 0 && lastRendered >= rows.length - endReachedThreshold) onEndReached();
  }, [onEndReached, lastRendered, rows.length, endReachedThreshold]);

  const renderedRows = virtual ? virtualItems.map((item) => rows[item.index]) : rows;
  const paddingTop = virtual && virtualItems.length > 0 ? virtualItems[0].start - scrollMargin : 0;
  const paddingBottom =
    virtual && virtualItems.length > 0 ? virtualizer.getTotalSize() - (virtualItems.at(-1)!.end - scrollMargin) : 0;
  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <Table className={cn("table-fixed", className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody ref={bodyRef}>
        {rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          <>
            {paddingTop > 0 && (
              <tr aria-hidden>
                <td style={{ height: paddingTop, padding: 0 }} />
              </tr>
            )}
            {renderedRows.map((row) => (
              <TableRow
                key={row.id}
                data-index={row.index}
                ref={virtual ? virtualizer.measureElement : undefined}
                data-state={row.getIsSelected() ? "selected" : undefined}
                data-active={row.index === activeRowIndex ? "true" : undefined}
                className={cn(
                  "data-[active=true]:bg-muted/70 data-[active=true]:shadow-[inset_3px_0_0_0_var(--primary)]",
                  rowClassName,
                )}
                onPointerDown={onRowPointerDown ? () => onRowPointerDown(row.index) : undefined}
                onClick={onRowClick ? (event) => onRowClick(row.original, event) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {paddingBottom > 0 && (
              <tr aria-hidden>
                <td style={{ height: paddingBottom, padding: 0 }} />
              </tr>
            )}
          </>
        )}
      </TableBody>
    </Table>
  );
}
