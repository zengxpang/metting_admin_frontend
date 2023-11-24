import {
  ParamsType,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import { TableProps } from 'antd/es/table/InternalTable';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IBaseProTableProps<DataType, Params, ValueType>
  extends ProTableProps<DataType, Params, ValueType> {}

function BaseProTable<
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(props: IBaseProTableProps<DataType, Params, ValueType>) {
  const { pagination, scroll, ...restProps } = props;
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const observeTableScroll = useCallback(() => {
    const tableWrapper = tableWrapperRef.current;
    if (!tableWrapper) return;
    const pageBottom: number = document.body.getBoundingClientRect().bottom;
    const theadBottom: number =
      tableWrapper.querySelector('.ant-table-thead')?.getBoundingClientRect()
        .bottom || 0;
    const paginationHeight = pagination !== false ? 40 : 0;
    const newScrollY = pageBottom - theadBottom - paginationHeight - 24 - 16; // 减去边距
    if (newScrollY !== scrollY) {
      setScrollY(newScrollY);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', debounce(observeTableScroll, 200));

    return () => {
      window.removeEventListener('resize', debounce(observeTableScroll, 200));
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(debounce(observeTableScroll, 200));
    if (tableWrapperRef.current) {
      observer.observe(tableWrapperRef.current, {
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [scroll?.y]);

  const memoScroll = useMemo(() => {
    const result: TableProps<DataType>['scroll'] = {};
    if (scroll?.x) {
      result['x'] = scroll.x;
    }
    if (scroll?.y || scrollY) {
      result['y'] = scroll?.y || scrollY;
    }
    return result;
  }, [scroll, scrollY]);

  return (
    <div ref={tableWrapperRef}>
      <ProTable pagination={pagination} scroll={memoScroll} {...restProps} />
    </div>
  );
}

BaseProTable.defaultProps = {
  columnEmptyText: '-',
};

export default BaseProTable;
