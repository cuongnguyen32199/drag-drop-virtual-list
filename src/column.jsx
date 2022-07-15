import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { List } from 'react-virtualized';

import Task from './task';
import { getBackgroundColor } from './utils';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: #ebecf0;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
  height: 40px;
  margin: 0;
`;

const grid = 8;

function Column({ column, index, tasks }) {
  const getRowRender = (_tasks) =>
    function Row({ style, index: taskIndex }) {
      const task = _tasks[taskIndex];

      if (!task) {
        return null;
      }

      const patchedStyle = {
        ...style,
        left: style.left + grid,
        top: style.top + grid,
        width: `calc(${style.width} - ${grid * 2}px)`,
        height: style.height === 'auto' ? style.height : style.height - grid,
      };

      return (
        <Draggable draggableId={task.id} index={taskIndex} key={task.id} style={style}>
          {(provided, snapshot) => <Task provided={provided} isDragging={snapshot.isDragging} task={task} style={patchedStyle} />}
        </Draggable>
      );
    };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(draggaleProvided) => (
        <Container {...draggaleProvided.draggableProps} ref={draggaleProvided.innerRef}>
          <Title {...draggaleProvided.dragHandleProps}>{`${column.title} (${tasks.length})`}</Title>
          <Droppable type="task" droppableId={column.id} mode="virtual" renderClone={(provided, snapshot, rubric) => <Task provided={provided} isDragging={snapshot.isDragging} task={tasks[rubric.source.index]} />}>
            {(droppableProvided, snapshot) => {
              const itemCount = snapshot.isUsingPlaceholder ? tasks.length + 1 : tasks.length;

              return (
                <List
                  height={document.documentElement.clientHeight - 103}
                  overscanRowCount={0}
                  rowCount={itemCount}
                  rowHeight={110}
                  width={298}
                  ref={(ref) => {
                    if (ref) {
                      // eslint-disable-next-line react/no-find-dom-node
                      const DOMRef = ReactDOM.findDOMNode(ref);
                      if (DOMRef instanceof HTMLElement) {
                        droppableProvided.innerRef(DOMRef);
                      }
                    }
                  }}
                  style={{
                    backgroundColor: getBackgroundColor(snapshot.isDraggingOver, Boolean(snapshot.draggingFromThisWith)),
                  }}
                  rowRenderer={getRowRender(tasks)}
                />
              );
            }}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default Column;
