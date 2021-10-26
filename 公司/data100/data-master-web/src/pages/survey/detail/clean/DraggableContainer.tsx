import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import styles from './cleanTab.less'
import { SortableContainer, SortableElement, SortableHandle, } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';


const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);


const DraggableContainer: React.FC = (props) => {
  const [items, setItems] = useState<Array>(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'])
  const SortableItem = SortableElement((props) => <div style={{ display: 'flex', alignItems: "center", margin: "20px" }}>
    <DragHandle />{props.children}</div>);
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div>
        {items.map((value: any, index: number) => (
          <SortableItem key={`item-${value}`} index={index} value={value} >
            <div>{value}</div>
            </SortableItem>
        ))}
      </div>
    );
  });
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setItems(arrayMoveImmutable(items, oldIndex, newIndex))
    }
  };

  return (
    
    <SortableList items={items} onSortEnd={onSortEnd} useDragHandle
      disableAutoscroll>
        
      </SortableList>
  )
}
export default DraggableContainer
